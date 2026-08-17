# Local Sports Indoor Games Partner Finder Platform

A full-stack MERN web application that helps users discover local sports players, explore indoor games, view player profiles, and send/manage partner requests. The platform also includes an admin dashboard for managing users, games, and partner requests.

## 🚀 Project Overview

The **Local Sports Indoor Games Partner Finder Platform** is designed to solve a simple problem: finding suitable sports partners for local and indoor games.

Users can:

- Register and log in securely.
- Access a personalized dashboard.
- Browse available players.
- View detailed player profiles.
- Explore available games.
- Find players associated with specific games.
- Manage their own profile and availability.
- Send and manage partner requests.

Administrators can:

- Access a dedicated admin dashboard.
- View and manage registered users.
- Manage available games.
- Monitor and manage partner requests.

---

## ✨ Key Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Protected user routes
- Protected admin routes
- Role-based access control

### User Features

- Personalized dashboard
- Player discovery
- Player profile/details view
- Game discovery
- Game-specific player discovery
- User profile management
- Availability management
- Partner request creation and management

### Admin Features

- Admin dashboard
- User management
- Game management
- Partner request management
- Admin-only protected routes

### Media Management

- Cloudinary integration for image storage
- Profile image upload
- Game image upload
- Multer-based upload middleware
- Lightweight image usage to keep the application efficient

---

## 🛠️ Technology Stack

### Frontend

- React.js
- Tailwind CSS
- shadcn/ui
- JavaScript
- Axios
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

### Image & File Upload

- Cloudinary
- Multer
- multer-storage-cloudinary

### Development & Deployment

- Git / GitHub
- Vercel / Render
- Environment variables

---

## 🏗️ System Architecture

The application follows a standard MERN architecture:

```text
React Frontend
      │
      │ HTTP / REST API
      ▼
Express.js + Node.js Backend
      │
      ├── Authentication & Authorization
      ├── User Management
      ├── Player Management
      ├── Game Management
      ├── Partner Request Management
      └── Admin Management
      │
      ▼
MongoDB Database

Cloudinary
   ▲
   │
Image Uploads
   │
Backend Upload Middleware
```

---

## 📁 Project Structure

```text
Local-Sports-Indoor-Games-Partner-Finder-Platform-/
│
├── Backend-/
│   │
│   ├── config-/
│   │   ├── cloudinary.js
│   │   └── db.js
│   │
│   ├── controllers-/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── gameController.js
│   │   ├── partnerRequestController.js
│   │   └── playerController.js
│   │
│   ├── middleware-/
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   ├── gameUploadMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models-/
│   │   ├── Game.js
│   │   ├── PartnerRequest.js
│   │   └── User.js
│   │
│   ├── routes-/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── gameRoutes.js
│   │   ├── partnerRequestRoutes.js
│   │   └── playerRoutes.js
│   │
│   ├── seeds-/
│   │   ├── adminSeed.js
│   │   └── gameSeed.js
│   │
│   ├── utils-/
│   │   └── generateToken.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── README.md
```

> The project structure above reflects the backend source structure supplied for this project.

---

# 🔐 Authentication & Authorization

The platform uses JWT-based authentication.

### Authentication Flow

```text
User
 │
 ├── Register
 │      │
 │      ▼
 │   Auth Controller
 │      │
 │      ▼
 │   Validate User
 │      │
 │      ▼
 │   Hash Password
 │      │
 │      ▼
 │   Save User → MongoDB
 │
 └── Login
        │
        ▼
     Verify Credentials
        │
        ▼
     Generate JWT
        │
        ▼
     Authenticated Session
```

### Authorization

Protected API endpoints use authentication middleware.

Admin-specific endpoints additionally use admin authorization middleware.

```text
Request
  │
  ▼
Authentication Middleware
  │
  ├── Invalid / Missing Token → Unauthorized
  │
  └── Valid Token
          │
          ▼
     Admin Middleware
          │
          ├── Non-admin → Forbidden
          │
          └── Admin → Continue
```

---

# 👤 User Module

The user module is responsible for the player-facing functionality of the platform.

Users can:

1. Register an account.
2. Log in.
3. Access their dashboard.
4. Browse players.
5. View player details.
6. Browse games.
7. Find players by game.
8. Manage their profile.
9. Manage availability.
10. Send and manage partner requests.

---

# 🤝 Partner Request Module

The partner request system allows users to connect with other players.

Typical flow:

```text
Player A
   │
   │ Send Partner Request
   ▼
Backend API
   │
   ▼
PartnerRequest
   │
   ▼
Player B
   │
   ├── Accept
   ├── Reject
   └── Manage Request
```

Partner requests are stored in MongoDB through the `PartnerRequest` model.

---

# 🎮 Game Module

The game module manages the sports and indoor games available on the platform.

Examples can include:

- Badminton
- Table Tennis
- Basketball
- Football
- Cricket
- Volleyball
- Chess

Games can include associated images stored through Cloudinary.

The admin can manage the available games from the admin dashboard.

---

# 🧑‍💼 Admin Module

Administrators have access to functionality that regular users do not.

### Admin capabilities

- View dashboard statistics/data
- View users
- Manage users
- View games
- Manage games
- View partner requests
- Manage partner requests

Admin access is protected using the dedicated admin middleware.

---

# ☁️ Cloudinary Image Management

The application uses Cloudinary for cloud-based image storage.

```text
Frontend
   │
   │ Image Upload
   ▼
Express API
   │
   ▼
Multer Middleware
   │
   ▼
Cloudinary
   │
   ▼
Cloudinary Image URL
   │
   ▼
MongoDB
```

Only essential images are used in the platform, primarily:

- User profile images
- Game images

This keeps the application lightweight and reduces unnecessary media storage and transfer.

---

# 🔌 Backend API Modules

The backend is organized around separate route/controller modules.

| Module | Route File | Controller |
|---|---|---|
| Authentication | `authRoutes.js` | `authController.js` |
| Players | `playerRoutes.js` | `playerController.js` |
| Games | `gameRoutes.js` | `gameController.js` |
| Partner Requests | `partnerRequestRoutes.js` | `partnerRequestController.js` |
| Administration | `adminRoutes.js` | `adminController.js` |

The exact endpoint paths and HTTP methods should be treated as defined by the corresponding route source files.

---

# 🗄️ Database Models

The backend currently contains three main Mongoose models.

### User

Responsible for storing player/account information.

Typical responsibilities include:

- Identity information
- Authentication credentials
- Profile information
- Preferred games
- Skill level
- Availability
- User role
- Profile image information

### Game

Responsible for storing the games available on the platform.

### PartnerRequest

Responsible for storing connection/partner requests between users.

---

# 🌱 Seed Data

The project includes seed scripts for initial application data.

```text
seeds/
├── adminSeed.js
└── gameSeed.js
```

### `adminSeed.js`

Used to create/configure an initial administrator account.

### `gameSeed.js`

Used to populate the database with initial games.

---

# ⚙️ Environment Variables

Create a `.env` file inside the `Backend-` directory.

Example:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

NODE_ENV=development
```

> Never commit real credentials, API keys, database passwords, JWT secrets, or Cloudinary secrets to GitHub.

---

# ▶️ Installation & Setup

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd Local-Sports-Indoor-Games-Partner-Finder-Platform-
```

## 2. Enter the backend

```bash
cd Backend-
```

## 3. Install dependencies

```bash
npm install
```

## 4. Configure environment variables

Create the `.env` file and add the required MongoDB, JWT, and Cloudinary credentials.

## 5. Start the backend

For development:

```bash
npm run dev
```

Or, depending on the scripts defined in `package.json`:

```bash
npm start
```

The backend will run on the configured port.

---

# 🖼️ Application Screenshots

## Landing Page

![Landing Page](https://res.cloudinary.com/diqr1juvf/image/upload/v1786983791/Landing-page_nvautz.png)

---

# 🔐 Authentication

## Register

![Register Page](https://res.cloudinary.com/diqr1juvf/image/upload/v1786983704/register-page_yiebop.png)

## Login

![Login Page](https://res.cloudinary.com/diqr1juvf/image/upload/v1786983702/Login-page_bn2smb.png)

---

# 👤 User Interface

## User Dashboard

![User Dashboard](https://res.cloudinary.com/diqr1juvf/image/upload/v1786984132/dashboard_aurj4h.png)

## Players

![User Players](https://res.cloudinary.com/diqr1juvf/image/upload/v1786985609/user-players_hf17n2.png)

## Player Details

![Player Details](https://res.cloudinary.com/diqr1juvf/image/upload/v1786985607/user-player-profile_hfzcic.png)

## Games

![User Games](https://res.cloudinary.com/diqr1juvf/image/upload/v1786985607/user-player-profile_hfzcic.png)

> The supplied screenshot URL for `user-games` is the same URL provided for `user-player-details`. Replace it with the correct game screenshot URL if a separate screenshot is available.

## Game Players

![Game Players](https://res.cloudinary.com/diqr1juvf/image/upload/v1786985535/game-players_k9tdl2.png)

## User Profile

![User Profile](https://res.cloudinary.com/diqr1juvf/image/upload/v1786985548/user-profile_u7m6ne.png)

## Partner Requests

![Partner Requests](https://res.cloudinary.com/diqr1juvf/image/upload/v1786985530/user-request_partner_zkuf0w.png)

---

# 🧑‍💼 Admin Interface

## Admin Dashboard

![Admin Dashboard](https://res.cloudinary.com/diqr1juvf/image/upload/v1786985684/Admin-dasboard_qzsoxw.png)

## Admin Users

![Admin Users](https://res.cloudinary.com/diqr1juvf/image/upload/v1786985694/user-admin-table_jjayzh.png)

## Admin Games

![Admin Games](https://res.cloudinary.com/diqr1juvf/image/upload/v1786985701/admin-games_q3edue.png)

## Admin Partner Requests

![Admin Partner Requests](https://res.cloudinary.com/diqr1juvf/image/upload/v1786985684/admin-request-partner_xs4lnr.png)

---

# 🔄 Application Data Flow

## User Registration

```text
Register Page
     │
     ▼
Auth API
     │
     ▼
authController
     │
     ├── Validate input
     ├── Hash password
     └── Create User
             │
             ▼
          MongoDB
```

## User Login

```text
Login Page
    │
    ▼
Auth API
    │
    ▼
authController
    │
    ├── Find user
    ├── Compare password
    └── Generate JWT
             │
             ▼
       Authenticated User
```

## Player Discovery

```text
User Dashboard
      │
      ▼
Player API
      │
      ▼
playerController
      │
      ▼
MongoDB
      │
      ▼
Available Players
      │
      ▼
React UI
```

## Partner Request

```text
Player Profile
      │
      ▼
Send Request
      │
      ▼
Partner Request API
      │
      ▼
partnerRequestController
      │
      ▼
PartnerRequest Model
      │
      ▼
MongoDB
      │
      ▼
Request Status
```

---

# 🔒 Security Considerations

The application implements several basic production-oriented security practices:

- Password hashing with `bcryptjs`
- JWT-based authentication
- Protected API routes
- Admin role authorization
- Environment variables for secrets
- Cloudinary credentials stored outside source code
- `.gitignore` for sensitive/local files

For production deployment, also ensure:

- HTTPS is enabled.
- Strong JWT secrets are used.
- MongoDB access is restricted.
- CORS is configured for trusted frontend origins.
- Production environment variables are configured securely.
- Debug/error details are not unnecessarily exposed to clients.

---

# 📦 Production Deployment

The application can be deployed using platforms such as:

- Frontend: Vercel
- Backend: Render or another Node.js-compatible hosting platform
- Database: MongoDB Atlas
- Images: Cloudinary

A typical production architecture:

```text
                    ┌─────────────────┐
                    │     Users       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ React Frontend  │
                    │     Vercel      │
                    └────────┬────────┘
                             │
                         REST API
                             │
                             ▼
                    ┌─────────────────┐
                    │ Node + Express  │
                    │     Backend     │
                    └──────┬───┬──────┘
                           │   │
                ┌──────────┘   └──────────┐
                ▼                         ▼
       ┌─────────────────┐       ┌─────────────────┐
       │ MongoDB Atlas   │       │    Cloudinary    │
       │     Database    │       │      Images      │
       └─────────────────┘       └─────────────────┘
```

---

# 🧪 Testing Checklist

Before deployment, verify:

- [ ] User registration works.
- [ ] User login works.
- [ ] Invalid credentials are rejected.
- [ ] Protected routes reject unauthenticated users.
- [ ] Admin routes reject regular users.
- [ ] Player listing loads correctly.
- [ ] Player details load correctly.
- [ ] Games load correctly.
- [ ] Game-specific players load correctly.
- [ ] Profile updates work.
- [ ] Availability updates correctly.
- [ ] Partner requests can be sent.
- [ ] Partner requests can be managed.
- [ ] Profile image upload works.
- [ ] Game image upload works.
- [ ] Cloudinary URLs are stored correctly.
- [ ] Admin user management works.
- [ ] Admin game management works.
- [ ] Admin partner request management works.
- [ ] Production environment variables are configured.
- [ ] CORS works with the production frontend.
- [ ] No secrets are committed to Git.

---

# 📌 Design Goals

The project focuses on:

- Simple user experience
- Lightweight architecture
- Clear separation between user and admin functionality
- Secure authentication
- Easy player discovery
- Easy partner discovery
- Minimal and purposeful image usage
- Maintainable MERN architecture
- Production-ready deployment practices

---

# 🔮 Future Improvements

Potential future enhancements include:

- Real-time chat between matched players
- Real-time notifications
- Location-based player matching
- Advanced player filtering
- Availability-based matching
- Game-specific skill matching
- Ratings and reviews
- Email notifications
- Push notifications
- Online/offline player status
- Analytics for administrators
- Advanced search and recommendation algorithms

---

# 👨‍💻 Development Philosophy

The platform is intentionally kept lightweight instead of introducing unnecessary services and complexity.

The core architecture is based on:

```text
React
  +
Express
  +
Node.js
  +
MongoDB
  +
Cloudinary
```

Additional infrastructure or third-party services should only be introduced when they provide a clear benefit to the application's requirements.

---

# 📄 License

Add the project's chosen license here, for example:

```text
MIT License
```

Update this section according to the actual repository license before publishing the project.

---

# 🙌 Conclusion

**Local Sports Indoor Games Partner Finder Platform** provides a centralized platform for discovering sports players, finding suitable game partners, managing requests, and administering the overall sports community.

The combination of **MERN, JWT authentication, Cloudinary, role-based authorization, and a dedicated admin dashboard** provides a strong foundation for extending the platform into a larger local sports community application.
