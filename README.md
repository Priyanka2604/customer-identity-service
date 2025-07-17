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

## 🚀 Tech Stack

- **Node.js** with **TypeScript**
- **PostgreSQL** (relational identity graph)
- **Express.js**
- **Render.com** for hosting
- **pg** PostgreSQL driver

---

## 📦 Project Structure
```
├── src/
│ ├── controllers/
│ ├── routes/
│ ├── services/
│ │ └── identity.service.ts
│ ├── config/
│ │ └── db.ts
│ └── index.ts
├── .env.example
├── README.md
```

### 📦 Setup & Run Locally

1. Clone this repo:
```bash
git clone https://github.com/priyanka2604/customer-identity-service.git
cd customer-identity-service
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file:
```env
DATABASE_URL=postgres://username:password@localhost:5432/customer_identity
PORT=3000
```

4. Create the contact table:
```bash
psql $DATABASE_URL -f migrations/create_contact_table.sql
```

5. Start the dev server:

```bash
npx ts-node-dev src/index.ts
```

### 🧪 API Endpoint: /identify
➤ POST /identify
```json
{
  "email": "george@example.com",
  "phoneNumber": "9999999999"
}
```

✅ Response:
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["george@example.com"],
    "phoneNumbers": ["9999999999"],
    "secondaryContactIds": [2, 3]
  }
}
```

- Automatically creates and links secondary contacts based on overlapping fields

- Ensures there is only one primary identity

### 🌐 Live Deployment
The service is live on Render:

🔗 https://customer-identity-service.onrender.com/identify

You can test the /identify endpoint using:

▶️ Postman or curl:
```bash
curl -X POST https://customer-identity-service.onrender.com/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "new@example.com", "phoneNumber": "8888888888"}'
```

### 🔐 Environment Variables
- .env.example is provided for reference.
- Never push your real .env to GitHub.















