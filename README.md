# PeachMural | Professional MERN Blog Application

PeachMural is a professional high-fidelity blogging application built using React.js (Vite compiler), Node.js, Express.js, TypeScript, Mongoose/MongoDB, Tailwind CSS, Context API for state management, and Cloudinary for image transformations. 

The user interface centers a lovely, eye-safe **Peach and Light Brown** aesthetic theme with crisp displays, fluid cards, responsive sidebars, customized details, and a dark/light mode toggle with state persistence.

---

## 🚀 Key Features

1. **Elegant Peach & Brown Aesthetic**: Cohesive warm design palette featuring Inter and Space Grotesk typography.
2. **Interactive Blog Cards**: Toggle likes, view comments, delete comments, and add new comments instantly on listing cards without leaving the context page.
3. **Robust Image Upload System**: Supports both click-to-select and Drag-and-Drop file processing, encoding to Base64 in standard mode or uploading to Cloudinary when configured.
4. **Interactive Dashboard**: Dynamically keeps track of user’s private statistics (total blogs written, like tally, and comment moderation room).
5. **Session Authorization**: Protected routes, JWT token issuance, and password hashing using `bcryptjs`.
6. **MERN Fallback System**: To guarantee out-of-the-box operation inside developer containers/previews, has a high-fidelity local JSON database engine that mimics MongoDB perfectly when `MONGODB_URI` environment keys are vacant.

---

## 🛠️ Technology Stack & Dependencies

- **Frontend**: React 19, TypeScript, React Router DOM, Tailwind CSS (v4), Axios, Lucide Icons, React Toastify
- **Backend**: Express.js, Node.js, Mongoose, JWT, bcryptjs, Cloudinary, TSX compiler, esbuild CJS bundling
- **Database**: MongoDB (Mongoose schemas) or fallback to local JSON database storage

---

## ⚙️ Environment Configuration

To configure real MongoDB and Cloudinary keys, add the following variables inside `.env`:

```env
# MongoDB Atlas link
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/peach_mural"

# JWT encryption key
JWT_SECRET="f7b6a482d92147320bdfcdfaaa39bdf1176"

# Cloudinary keys
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

---

## 💻 Running the Application

### 1. Installation:
Install packages:
```bash
npm install
```

### 2. Development Execution:
To start the custom Express Server (under port 3000) running the Vite client loader in middleware mode:
```bash
npm run dev
```

### 3. Production Compilation & Startup:
To build the application (client static files are compiled to `dist/` and Express TypeScript files are bundled directly into `dist/server.cjs` via esbuild):
```bash
npm run build
npm start
```
