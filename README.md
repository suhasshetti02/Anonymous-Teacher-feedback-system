# Anonymous Teacher Feedback System

A small Express / MongoDB API prototype for collecting student feedback about teachers and retrieving feedback summaries by teacher ID.

> **Project status:** Academic prototype. The current implementation does not provide a complete authenticated teacher/admin interface, and the duplicate-submission prevention logic needs correction before the system can be relied on for anonymous one-response-per-student collection.

## Implemented features

- Express API with a Mongoose connection to MongoDB.
- Feedback submission with teacher ID, feedback text, and a client-supplied device fingerprint.
- Feedback records with generated UUIDs and submission timestamps.
- Participation records intended to prevent repeated feedback from the same device for a teacher.
- Query endpoint that groups feedback by teacher ID and returns the total and feedback texts.

## Technology stack

- Node.js
- Express 4
- MongoDB / Mongoose
- bcryptjs
- dotenv
- uuid (imported by the route module; currently missing from the checked-in package dependencies)
- nodemon for development

## Repository layout

The application source is currently nested under:

```text
OneDrive/Desktop/New/anonymous/
├── config/db.js
├── models/
│   ├── Feedback.js
│   └── Participation.js
├── routes/feedbackroutes.js
├── server.js
└── package.json
```

The source should eventually be moved to a clean repository-root project structure rather than retaining a local OneDrive folder path.

## Run locally

1. Navigate to the application directory:

```bash
cd OneDrive/Desktop/New/anonymous
```

2. Install dependencies:

```bash
npm install
```

3. Add the missing `uuid` dependency before starting, because `routes/feedbackroutes.js` imports `uuid` but it is not listed in the current `package.json`:

```bash
npm install uuid
```

4. Create a local `.env` file with the MongoDB connection string expected by `config/db.js`:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

5. Start the server:

```bash
npm start
```

The API listens on port 5000 by default.

## API routes

The Express app mounts the feedback router at `/api/feedback`. The router then defines:

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | Basic server health message |
| POST | `/api/feedback/feedback` | Submit a feedback record |
| GET | `/api/feedback/:teacher_id` | Retrieve feedback grouped for a teacher |

The POST body currently expects:

```json
{
  "teacher_id": "teacher-id",
  "feedback_text": "Feedback text",
  "device_fingerprint": "client-generated-device-identifier"
}
```

## Important correctness and security issues

- **Duplicate detection is currently ineffective:** the route hashes the device fingerprint with bcrypt and then searches for an exact match of that hash. bcrypt generates a new random salt for each hash, so the same fingerprint normally produces a different stored hash. Use a stable keyed HMAC (with a server-side secret) or another privacy-preserving deterministic identifier for lookup; do not store a raw fingerprint.
- **The fingerprint is supplied by the client:** it can be changed or spoofed and should not be treated as a reliable identity or authentication factor.
- **The feedback and participation records are saved separately:** a failure between the two saves can leave one record without the other. Use a database transaction or an idempotent write pattern.
- **Feedback retrieval has no authentication / authorization in the current route:** anyone who can reach the endpoint may be able to retrieve feedback for a known teacher ID. Restrict access and define who is allowed to read submissions.
- **No content moderation, rate limiting, or robust request-size validation is visible in the current route.**
- **The current project does not include a frontend in this repository tree.**
- **The imported `uuid` package is not declared in package.json** and must be added for the route module to load reliably.

## License

See repository license and dependency terms.
