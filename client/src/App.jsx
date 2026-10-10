import { Routes, Route } from "react-router-dom";

// Auth Pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import VerifyEmailPending from "./pages/Auth/VerifyEmailPending";

// Dashboard Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";

// Interview Pages
import CreateInterview from "./pages/Interview/CreateInterview";
import InterviewSession from "./pages/Interview/InterviewSession";
import InterviewResult from "./pages/Interview/InterviewResult";
import InterviewHistory from "./pages/Interview/InterviewHistory";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

// Resume Intelligence Page
import ResumeIntelligence from "./pages/Resume/ResumeIntelligence";

// Remaining Pages
import Home from "./pages/Home";
import Profile from "./pages/Profile/Profile";
import CareerAssistant from "./pages/Chatbot/CareerAssistant";
import PreparationHub from "./pages/Preparation/PreparationHub";
import PreparationSession from "./pages/Preparation/PreparationSession";
import QuizSession from "./pages/Preparation/QuizSession";
import StudyPlanner from "./pages/StudyPlan/StudyPlanner";
import Analytics from "./pages/Analytics/Analytics";

function App() {
    return (
        <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route
                path="/verify-email/:token"
                element={<VerifyEmail />}
            />

            <Route
                path="/verify-email-pending"
                element={<VerifyEmailPending />}
            />

            {/* Student Dashboard */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* AI Mock Interview Routes */}
            <Route
                path="/create-interview"
                element={
                    <ProtectedRoute>
                        <CreateInterview />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/interview/:id"
                element={
                    <ProtectedRoute>
                        <InterviewSession />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/result/:id"
                element={
                    <ProtectedRoute>
                        <InterviewResult />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/history"
                element={
                    <ProtectedRoute>
                        <InterviewHistory />
                    </ProtectedRoute>
                }
            />

            {/* Resume Intelligence */}
            <Route
                path="/resume-intelligence"
                element={
                    <ProtectedRoute>
                        <ResumeIntelligence />
                    </ProtectedRoute>
                }
            />

            {/* Profile Route */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            {/* Chatbot Route */}
            <Route
                path="/chatbot"
                element={
                    <ProtectedRoute>
                        <CareerAssistant />
                    </ProtectedRoute>
                }
            />

            {/* Preparation Hub Routes */}
            <Route
                path="/preparation"
                element={
                    <ProtectedRoute>
                        <PreparationHub />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/preparation/:id"
                element={
                    <ProtectedRoute>
                        <PreparationSession />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/preparation/:id/quiz"
                element={
                    <ProtectedRoute>
                        <QuizSession />
                    </ProtectedRoute>
                }
            />

            {/* Study Planner Route */}
            <Route
                path="/study-plan"
                element={
                    <ProtectedRoute>
                        <StudyPlanner />
                    </ProtectedRoute>
                }
            />

            {/* Analytics & Achievements Route */}
            <Route
                path="/analytics"
                element={
                    <ProtectedRoute>
                        <Analytics />
                    </ProtectedRoute>
                }
            />

            {/* Admin Dashboard */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute adminOnly>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

export default App;