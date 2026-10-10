import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import preparationRoutes from "./routes/preparationRoutes.js";
import studyPlanRoutes from "./routes/studyPlanRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, "../public");
const uploadsPath = path.resolve(__dirname, "../uploads");

const app = express();

// Middleware
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5000",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (
            !origin ||
            allowedOrigins.includes(origin) ||
            origin.startsWith("http://localhost:") ||
            origin.startsWith("http://127.0.0.1:") ||
            origin.endsWith(".vercel.app")
        ) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked for origin: ${origin}`));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Serve static uploaded files
app.use("/uploads", express.static(uploadsPath));

// Serve frontend static build files
app.use(express.static(publicPath));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", chatbotRoutes);
app.use("/api/preparation", preparationRoutes);
app.use("/api/study-plan", studyPlanRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "OK" });
});

// API 404 handler
app.all("/api/*", (req, res) => {
    res.status(404).json({ message: "API route not found" });
});

// Serve frontend React SPA for all non-API GET routes
app.get("*", (req, res) => {
    const indexPath = path.join(publicPath, "index.html");
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("Frontend build not found. Please ensure the client build is in server/public.");
    }
});

export default app;
