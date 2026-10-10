
# 🏡 Room Nest

### Find Your Trusted Nest

Room Nest is a modern property and room rental platform designed to make finding and managing rental accommodations easier. It provides a user-friendly experience for renters, landlords, and administrators through property discovery, room management, authentication, booking workflows, and payment integration.

The project consists of a **Next.js frontend** and a **Node.js/Express backend**, connected through a REST API.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [User Roles](#-user-roles)
- [Frontend Application](#-frontend-application)
- [Backend Application](#-backend-application)
- [Authentication and Security](#-authentication-and-security)
- [Property and Room Management](#-property-and-room-management)
- [Booking and Payments](#-booking-and-payments)
- [Database](#-database)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [API Overview](#-api-overview)
- [Error Handling](#-error-handling)
- [Deployment](#-deployment)
- [Security Best Practices](#-security-best-practices)
- [Future Improvements](#-future-improvements)
- [Author](#-author)
- [License](#-license)

---

## 🌟 Overview

Finding a suitable rental property can be challenging. Room Nest aims to simplify this process by providing a centralized platform where users can explore properties, review room details, and access rental-related services.

The platform is designed around three main roles:

- **Users:** Explore properties and access renter-related functionality.
- **Landlords:** Create and manage property listings and room information.
- **Administrators:** Manage platform resources and oversee property-related operations.

The application is developed as two independent applications:

| Application | Directory | Description |
|---|---|---|
| Frontend | `room_nest_client` | Next.js web application |
| Backend | `room_nest_server` | Express REST API |

---

## ✨ Key Features

### 🏠 Property Discovery

- Browse available properties and rooms.
- View detailed property information.
- Explore property images and room details.
- Access property search and filtering interfaces.
- View rental information and availability.

### 🔐 Authentication

- User registration and login.
- Email verification using OTP.
- Access-token and refresh-token workflows.
- Logout and profile management.
- Google authentication support.
- Password-related account management.
- Protected routes and role-based authorization.

### 🏢 Landlord Management

- Create property listings.
- Upload property and room images.
- Manage rental information.
- Configure room capacity and roommate details.
- Track property verification and approval status.

### 🛡️ Administration

- Role-restricted administrative operations.
- Property and amenity management.
- Property approval and verification workflows.
- Dashboard interfaces for platform management.

### 📅 Booking and Payments

- Booking-related workflows.
- Room availability management.
- Security deposit and monthly rent payment scenarios.
- bKash payment integration.
- Payment status and callback handling.

### 🎨 User Experience

- Responsive layouts for mobile, tablet, and desktop.
- Light and dark theme support.
- Framer Motion animations.
- Reusable UI components.
- Loading, empty, and error states.
- Custom 404 and global error pages.

> **Note:** Features are described according to the project's development context. Check the current source code to confirm which workflows are fully implemented and production-ready.

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework and App Router |
| React 19 | UI development |
| TypeScript | Static type checking |
| Tailwind CSS | Styling and responsive design |
| Framer Motion | Animations and transitions |
| Lucide React | Icons |
| TanStack Query v5 | Server-state management |
| TanStack Form | Form state management |
| ofetch | API communication |
| Base UI / shadcn-based components | Reusable UI elements |
| Biome | Formatting and code quality |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API |
| TypeScript | Type-safe backend development |
| PostgreSQL | Relational database |
| Prisma ORM | Database access and schema management |
| Redis | Temporary data and token-related storage |
| Nodemailer | Email delivery |
| EJS | Email templates |
| Multer | Image upload handling |
| bKash API | Payment integration |
| Biome | Formatting and code quality |

---

## 🏗️ Project Architecture

```text
Room Nest
│
├── room_nest_client/
│   ├── Next.js App Router
│   ├── React + TypeScript
│   ├── Tailwind CSS
│   ├── Framer Motion
│   ├── TanStack Query
│   └── ofetch API client
│
└── room_nest_server/
    ├── Node.js
    ├── Express.js
    ├── TypeScript
    ├── Prisma ORM
    ├── PostgreSQL
    ├── Redis
    ├── Nodemailer + EJS
    └── bKash integration
```

### Request Flow

1. A user interacts with the Next.js frontend.
2. The frontend sends an HTTP request to the Express API.
3. The backend validates the request and checks authentication and authorization.
4. Prisma communicates with PostgreSQL when persistent data is needed.
5. Redis supports temporary data and token-related workflows.
6. The backend returns a response to the frontend.
7. TanStack Query manages server state and updates the UI.

---

## 👥 User Roles

### USER

- Access public pages.
- Browse properties.
- View property details.
- Use renter-related functionality available to the account.

### LANDLORD

- Access landlord-specific dashboard pages.
- Create and manage property listings.
- Submit property and room images.
- Manage rental and room information.
- View landlord-related resources permitted by the backend.

### ADMIN

- Access administrative functionality.
- Manage amenities and other authorized resources.
- Perform property-management operations.
- Access administrative dashboard data.

**Security note:** Backend authorization must enforce role permissions. Frontend route protection alone is not sufficient.

---

## 💻 Frontend Application

**Directory:** `room_nest_client`

The frontend is built with Next.js App Router and TypeScript.

### Frontend Responsibilities

- Render public and protected pages.
- Manage authentication-related UI.
- Fetch API data through reusable API functions.
- Manage server state with TanStack Query.
- Provide responsive navigation and dashboard layouts.
- Display property listings and details.
- Support light and dark themes.
- Handle loading, success, and error states.

### Frontend API Configuration

The API client should use an environment variable for the backend URL rather than hardcoding deployment-specific URLs throughout the application.

For browser-accessible configuration in Next.js, a variable such as `NEXT_PUBLIC_API_URL` is commonly used. Confirm the actual variable name expected by the current API client before configuring it.

---

## ⚙️ Backend Application

**Directory:** `room_nest_server`

The backend provides a REST API using Express.js and TypeScript.

### Backend Responsibilities

- Authentication and authorization.
- User and profile management.
- Email verification.
- Property and room management.
- Image upload processing.
- Amenity management.
- Booking and payment workflows.
- Database operations through Prisma.
- Temporary data storage through Redis.
- Transactional email delivery.
- Consistent API responses and error handling.

### Backend Design Principles

- Separate route, controller, service, and validation responsibilities.
- Validate incoming data.
- Apply authentication and role-based authorization.
- Use database transactions when multiple operations must remain consistent.
- Protect sensitive credentials and tokens.
- Avoid exposing internal server errors to clients.

---

## 🔑 Authentication and Security

The project includes token-based authentication and email verification workflows.

### Email Verification Flow

1. A user submits registration information.
2. Temporary verification data is stored in Redis.
3. An OTP is sent through email.
4. The user submits the verification code.
5. The backend validates the code and creates the account.
6. Authentication tokens are issued according to the configured flow.

The current project context has used a short expiration period for verification data. Confirm the current implementation before relying on a specific OTP lifetime.

### Security Measures

- Password hashing.
- Email verification.
- Authentication middleware.
- Role-based authorization.
- Token expiration and refresh workflows.
- Input validation.
- Upload restrictions.
- Environment-based secret management.
- Server-side payment verification.

---

## 🏘️ Property and Room Management

The property domain supports the following property types:

- `APARTMENT`
- `HOUSE`
- `SUBLET`
- `HOSTEL`
- `ROOM`

Property records include verification and approval-related fields. The current design includes a `PENDING` status and a `verified` flag.

Room-related information includes:

- Current roommate count.
- Maximum roommate capacity.
- Rent amount.
- Optional sub-rent amount.
- Room availability status.

### Image Upload Configuration

The existing backend configuration has used these upload fields:

| Field Name | Maximum Files |
|---|---:|
| `property_images` | 6 |
| `rooms_images` | 4 |

Check the current Multer configuration for the authoritative limits.

---

## 💳 Booking and Payments

Room Nest includes booking-related and payment-related backend functionality.

### Payment Scenarios

- Security deposit.
- Monthly rent.
- bKash payment integration.
- Payment callback handling.

### Payment Security

Payment confirmation should always be validated by the backend.

Before production deployment, verify:

- Payment callback URLs.
- Transaction validation.
- Duplicate callback protection.
- Booking and payment status consistency.
- Handling of failed and cancelled payments.
- Provider-side transaction confirmation.
- Secure storage of payment credentials.

Never trust a frontend redirect alone as proof of successful payment.

---

## 🗄️ Database

**Database:** PostgreSQL  
**ORM:** Prisma  
**Temporary Storage:** Redis

Prisma manages database access and schema definitions.

The domain includes resources such as:

- Users.
- Profiles.
- Properties.
- Rooms.
- Amenities.
- Bookings.
- Payments.

Review the current Prisma schema before changing models or applying migrations.

**Important:** Never run destructive database commands against production without a verified backup and an approved migration plan.

---

## 🚀 Getting Started

### Prerequisites

Install the following tools:

- Node.js compatible with the project's dependencies.
- pnpm.
- PostgreSQL.
- Redis.
- Git.

Email-provider credentials are needed for email workflows. bKash credentials are needed only when testing the payment integration.

### 1. Open the Backend

```bash
cd room_nest_server
```

Install dependencies:

```bash
pnpm install
```

### 2. Configure Backend Environment

Create the backend `.env` file using the variable names required by the current source code.

Configure PostgreSQL, Redis, authentication, email, and any required payment settings.

### 3. Prepare the Database

Review the Prisma schema and the scripts in `package.json`.

Run the project's documented database migration and Prisma Client generation commands.

Do not assume a migration command without checking the current Prisma configuration.

### 4. Start the Backend

If the backend's `package.json` defines a `dev` script:

```bash
pnpm dev
```

The backend has used port `5000` during development. Confirm the configured port in the current application.

### 5. Open the Frontend

Open another terminal:

```bash
cd room_nest_client
```

Install dependencies:

```bash
pnpm install
```

Create `.env.local` and configure the frontend API URL.

### 6. Start the Frontend

If the frontend's `package.json` defines a `dev` script:

```bash
pnpm dev
```

Open the local URL printed in the terminal. Next.js commonly uses:

```text
http://localhost:3000
```

### 7. Verify the Application

- Confirm the frontend loads.
- Confirm the backend is reachable.
- Verify the API base URL.
- Test registration and email verification.
- Test login and logout.
- Test role-based access.
- Test property creation and image uploads.
- Test payment workflows only with sandbox credentials.

---

## 🔐 Environment Variables

The following names are examples of common configuration variables. They are not guaranteed to match every name in the current source code. Confirm the actual names in the configuration modules before using them.

### Backend `.env`

```env
NODE_ENV=development
PORT=5000

DATABASE_URL=your_postgresql_connection_string
REDIS_URL=your_redis_connection_string

FRONTEND_URL=http://localhost:3000

ACCESS_TOKEN_SECRET=replace_with_a_secure_secret
REFRESH_TOKEN_SECRET=replace_with_another_secure_secret

SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM=your_sender_email

BKASH_BASE_URL=your_bkash_api_url
BKASH_APP_KEY=your_bkash_app_key
BKASH_APP_SECRET=your_bkash_app_secret
BKASH_USERNAME=your_bkash_username
BKASH_PASSWORD=your_bkash_password
```

Remove or rename example variables to match the actual backend configuration. Do not use placeholder values as production credentials.

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Use this variable only if the frontend API client expects `NEXT_PUBLIC_API_URL`.

**Never expose database URLs, Redis credentials, token-signing secrets, SMTP passwords, or bKash secrets through `NEXT_PUBLIC_*` variables.**

---

## 📜 Available Scripts

Check each application's `package.json` for the exact scripts.

Common examples include:

```bash
# Install dependencies
pnpm install

# Run development server, if configured
pnpm dev

# Build the application, if configured
pnpm build

# Run linting, if configured
pnpm lint
```

The backend uses TypeScript compilation for its build process. Biome is used for formatting and code quality.

---

## 📂 Project Structure

### Frontend

```text
room_nest_client/
├── public/
├── src/
│   └── app/
│       ├── (public)/
│       ├── (authentication)/
│       ├── (dashboard)/
│       ├── not-found.tsx
│       ├── global-error.tsx
│       ├── layout.tsx
│       └── globals.css
├── components/
├── hooks/
├── lib/
├── providers/
├── package.json
└── README.md
```

### Backend

```text
room_nest_server/
├── src/
│   ├── app/
│   ├── middleware/
│   ├── modules/
│   └── ...
├── prisma/
│   └── schema/
├── templates/
├── generated/
├── package.json
└── README.md
```

These structures are illustrative. Refer to the current repository for the exact file and directory layout.

---

## 🔌 API Overview

The backend uses modular Express routes.

Examples from the project context include:

| Method | Example Route | Purpose |
|---|---|---|
| `POST` | `/create-properties` | Create a property |
| `GET` | `/get-amenities` | Retrieve amenities |
| `POST` | `/add-amenities` | Add an amenity |
| `DELETE` | `/delete-amenities` | Delete an amenity |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/logout` | User logout |
| `GET` | `/api/auth/my-profile` | Retrieve the current user profile |

Actual endpoint URLs depend on how Express routers are mounted and how the frontend API client constructs requests. Confirm the final paths in the current source code.

---

## ⚠️ Error Handling

The frontend includes custom error interfaces:

- `not-found.tsx` — displays a custom 404 page.
- `global-error.tsx` — displays a root-level error boundary page.
- `error.tsx` — can handle errors within a route segment.

These interfaces do not automatically catch every backend failure or a completely unavailable server.

API failures should also be handled in the API client and query/mutation logic. Production applications should use appropriate server-side logging and monitoring without exposing sensitive error details to users.

---

## ☁️ Deployment

The frontend and backend can be deployed independently.

### Frontend Deployment

- Configure the production API URL.
- Verify public and protected routes.
- Configure authentication cookies and allowed origins as needed.
- Test responsive layouts and theme contrast.
- Run the production build before deploying.

### Backend Deployment

- Configure PostgreSQL and Redis.
- Add environment variables using the deployment provider's secret settings.
- Apply database migrations using the project's production procedure.
- Confirm Prisma Client generation and module resolution.
- Verify the start command and build output.
- Configure CORS, authentication cookies, and the frontend origin.
- Ensure uploaded files use persistent or external storage when the hosting filesystem is ephemeral.

### Production Checklist

- [ ] Database connectivity verified.
- [ ] Redis connectivity verified.
- [ ] Email delivery tested.
- [ ] Authentication and authorization tested.
- [ ] Image uploads tested.
- [ ] Payment callbacks validated.
- [ ] Error handling and logging reviewed.
- [ ] Secrets excluded from source control.
- [ ] Production build successful.

---

## 🧰 Troubleshooting

### API requests fail

- Verify the API base URL.
- Confirm the backend is running.
- Check CORS settings.
- Verify the final route prefix.

### Authentication returns `401`

- Check token or session validity.
- Verify cookie settings.
- Confirm frontend and backend authentication behavior.
- Check authorization middleware.

### Email verification fails

- Verify SMTP credentials.
- Check Redis connectivity and OTP expiration.
- Confirm email links and verification routes.

### Image upload fails

- Verify multipart field names.
- Check file count, type, and size restrictions.
- Confirm the configured storage location.

### Database or Prisma errors

- Verify `DATABASE_URL`.
- Check database migrations.
- Review the Prisma schema and generated-client configuration.

### Production build fails

- Run the build locally.
- Review TypeScript errors.
- Verify Node.js compatibility.
- Check module imports and deployment configuration.

---

## 🔮 Future Improvements

Potential improvements include:

- Complete end-to-end testing of renter, landlord, and admin workflows.
- Improve property search, filters, and pagination.
- Strengthen booking and payment lifecycle handling.
- Add automated tests and API documentation.
- Improve centralized error handling and monitoring.
- Add persistent cloud storage for property images.
- Audit security and accessibility.
- Improve production analytics and health checks.

---

## 👨‍💻 Author

**Shajidur Rahman Jisan**  
Full Stack Developer

- GitHub: [jisan123](https://github.com/jisan123)

---

## 📄 License

No license has been specified yet. Add a `LICENSE` file before distributing or open-sourcing the project.

---

<p align="center">
  <strong>Room Nest — Find Your Trusted Nest 🏡</strong>
</p>