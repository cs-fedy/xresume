## _**xresume: Your Personalized CV Generator**_

xresume empowers you to craft a tailored and job-specific CV with ease.

### _**Features**_

- **Guided Input:** Provide your details, and the app assists you through relevant CV information.
- **Template Selection:** Choose from a variety of professionally designed admin-provided templates to personalize your CV's visual style.
- **Job-Specific Optimization:** Upload a job description, and the app tailors your CV to highlight relevant skills and experience for that specific role.
- **Seamless Editing:** Refine the generated CV to flawlessly reflect your qualifications.

### _**Technologies**_

- Frontend: Next.js - [https://nextjs.org](https://nextjs.org)
- Backend API: tRPC - [https://trpc.io](https://trpc.io)
- Database: PostgreSQL (Docker for development) - [https://www.postgresql.org](https://www.postgresql.org)
- Styling: Tailwind CSS - [https://tailwindcss.com](https://tailwindcss.com)

### _**Getting Started (Development)**_

1. Clone the repository:

```bash
git clone https://github.com/<cs-fedy>/xresume.git
```

2. Install dependencies:

```bash
cd xresume
npm install
```

3. Environment Setup:

Create a .env file in the project root directory (not tracked by Git) and add the following key-value pairs, replacing placeholders with your actual values:

```bash
ENV="development"
POSTGRES_PASSWORD="admin"
POSTGRES_DB="xresume"
POSTGRES_USER="admin"

NEXT_PUBLIC_GOOGLE_CLIENT_ID="your_google_client_id"
NEXT_PUBLIC_CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your_cloudinary_api_key"
NEXT_PUBLIC_CLOUDINARY_NAME="your_cloudinary_name"

DATABASE_URL="postgresql://admin:admin@localhost:5432/xresume?schema=public"

```

- **Important:** Never commit your .env file to version control, as it may contain sensitive information like passwords.

4. Run the application:

Docker Compose is required for development. Ensure you have Docker installed.

```bash
docker-compose up -d
npm run dev
```

This will start the application in development mode at `http://localhost:3000` by default.
