// services/contact.service.ts

import { log } from 'node:console';
import pool from '../config/db';
import { getAllLinkedContacts, Contact } from './identity.service';
import { console } from 'node:inspector';

export const identifyContact = async (email?: string, phonenumber?: string) => {
  if (!email && !phonenumber) {
    throw new Error('Either email or phoneNumber is required');
  }

  // Step 1: Find existing contacts with same email or phone
  const result = await pool.query<Contact>(
    `SELECT * FROM contact WHERE email = $1 OR phoneNumber = $2`,
    [email, phonenumber]
  );

  let contacts = result.rows;

  if (contacts.length === 0) {
    // No match — create new primary contact
    const insert = await pool.query<Contact>(
      `INSERT INTO contact (email, phoneNumber, linkedId, linkPrecedence)
       VALUES ($1, $2, NULL, 'primary') RETURNING *`,
      [email, phonenumber]
    );
    contacts = [insert.rows[0]];
  } else {
    // Step 2: Determine root primary ID
    const allPrimaryIds = contacts.map(c => c.linkedId ?? c.id);
    const primaryId = Math.min(...allPrimaryIds);

    // Step 3: Check for exact match
    console.log('Contacts found:', contacts);
    const exactMatch = contacts.find(
      c => c.phonenumber === phonenumber && c.email === email
    );

    if (!exactMatch) {
      const emailExists = contacts.some(c => c.email === email);
      const phoneExists = contacts.some(c => c.phonenumber === phonenumber);

      if (emailExists || phoneExists) {
        await pool.query(
          `INSERT INTO contact (email, phoneNumber, linkedId, linkPrecedence)
           VALUES ($1, $2, $3, 'secondary')`,
          [email, phonenumber, primaryId]
        );

        // Step 4: Get full related contact chain
        contacts = await getAllLinkedContacts(primaryId);
      }
    }
  }

  // Step 5: Format response
  const resolvedPrimaryId = Math.min(...contacts.map(c => c.linkedId ?? c.id));
  const primaryContact = contacts.find(c => c.id === resolvedPrimaryId);

  if (!primaryContact) throw new Error('Primary contact not found');

  const emails = [...new Set(contacts.map(c => c.email).filter(Boolean))];
  const phoneNumbers = [...new Set(contacts.map(c => c.phonenumber).filter(Boolean))];
  const secondaryContactIds = contacts
    .filter(c => c.linkprecedence === 'secondary')
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
