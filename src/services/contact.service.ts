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