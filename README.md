# customer-identity-service
## Bitespeed Backend Task: Identity Reconciliation

This service resolves and unifies customer identities using their email and/or phone number.  
It helps Bitespeed identify returning customers across multiple purchases on FluxKart.com, even when partial contact information is available.

### 🔍 Problem Statement

FluxKart checkout events always contain either an **email** or a **phoneNumber**.  
However, customers may use different combinations of these over time.  
To maintain a single source of truth, Bitespeed stores and links related contacts in a **relational database** using a `Contact` table.

This project implements the logic to:
- Identify if the contact already exists.
- Link contacts that refer to the same person.
- Maintain primary/secondary relationships for unified identity tracking.

---

### ⚙️ Tech Stack
- Node.js / Express
- PostgreSQL
- REST API

---

### 📦 Setup

```bash
git clone https://github.com/priyanka2604/customer-identity-service.git
cd customer-identity-service
npm install

