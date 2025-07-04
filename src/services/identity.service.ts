// services/resolve_identity_chain.ts

import pool from '../config/db';

export interface Contact {
  id: number;
  phonenumber: string | null;
  email: string | null;
  linkedId: number | null;
  linkprecedence: 'primary' | 'secondary';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/**
 * Recursively resolves and returns all contacts linked to the given primary ID.
 * Includes both direct and indirect relationships in the contact chain.
 * Uses BFS and Set to avoid processing duplicates.
 *
 * @param primaryId - The ID of the primary contact
 * @returns A list of all linked Contact objects in the identity chain
 */
export const getAllLinkedContacts = async (primaryId: number): Promise<Contact[]> => {
  const allContacts = (await pool.query<Contact>(`SELECT * FROM contact`)).rows;

  // Step 1: Identify primary contact with earliest createdAt
  const primaryCandidates = allContacts.filter(c => (c.linkedId === null && c.linkprecedence === 'primary'));
  if (primaryCandidates.length > 1) {
    const sorted = primaryCandidates.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const truePrimary = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      if (current.id !== truePrimary.id) {
        await pool.query(
          `UPDATE contact SET linkPrecedence = 'secondary', linkedId = $1 WHERE id = $2`,
          [truePrimary.id, current.id]
        );
      }
    }
  }

  const visited = new Set<number>();
  const queue: number[] = [primaryId];
  const linkedContacts: Contact[] = [];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const directlyLinked = allContacts.filter(
      c =>
        c.id === currentId ||
        c.linkedId === currentId ||
        (c.linkedId !== null && visited.has(c.linkedId))
    );

    for (const contact of directlyLinked) {
      if (!visited.has(contact.id)) {
        queue.push(contact.id);
      }
      linkedContacts.push(contact);
    }
  }

  return linkedContacts;
};
