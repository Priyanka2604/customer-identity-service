import pool from '../config/db';

interface Contact {
  id: number;
  phoneNumber: string | null;
  email: string | null;
  linkedId: number | null;
  linkPrecedence: 'primary' | 'secondary';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export const identifyContact = async (email?: string, phoneNumber?: string) => {
  if (!email && !phoneNumber) {
    throw new Error('Either email or phoneNumber is required');
  }

  // Step 1: Find existing contacts
  const result = await pool.query<Contact>(
    `
    SELECT * FROM contact
    WHERE email = $1 OR phoneNumber = $2
    `,
    [email, phoneNumber]
  );

  let contacts = result.rows;

  if (contacts.length === 0) {
    // No contact found → insert new as primary
    const insert = await pool.query<Contact>(
      `
      INSERT INTO contact (email, phoneNumber, linkedId, linkPrecedence)
      VALUES ($1, $2, NULL, 'primary')
      RETURNING *;
      `,
      [email, phoneNumber]
    );
    contacts = [insert.rows[0]];
  } else {
    // Contacts exist → find the earliest primary
    const primaryContact = contacts.find(c => c.linkPrecedence === 'primary') ||
                           contacts.find(c => c.linkedId === null);

    const primaryId = primaryContact?.id || contacts[0].linkedId;

    // If exact email+phone not found, insert secondary
    const exactMatch = contacts.find(
      c => c.email === email && c.phoneNumber === phoneNumber
    );

    if (!exactMatch) {
      await pool.query(
        `
        INSERT INTO contact (email, phoneNumber, linkedId, linkPrecedence)
        VALUES ($1, $2, $3, 'secondary');
        `,
        [email, phoneNumber, primaryId]
      );
    }

    // Reload all related contacts
    const rel = await pool.query<Contact>(
      `
      SELECT * FROM contact
      WHERE id = $1 OR linkedId = $1
      `,
      [primaryId]
    );

    contacts = rel.rows;
  }

  // Split into primary/secondary IDs
  const primaryContact = contacts.find(c => c.linkPrecedence === 'primary')!;
  const emails = [...new Set(contacts.map(c => c.email).filter(Boolean))];
  const phoneNumbers = [...new Set(contacts.map(c => c.phoneNumber).filter(Boolean))];
  const secondaryContactIds = contacts
    .filter(c => c.linkPrecedence === 'secondary')
    .map(c => c.id);

  return {
    contact: {
      primaryContactId: primaryContact.id,
      emails,
      phoneNumbers,
      secondaryContactIds,
    }
  };
};
