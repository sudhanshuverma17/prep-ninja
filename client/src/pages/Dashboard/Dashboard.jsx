import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getInterviews } from "../../services/interviewService";
import { getAnalytics } from "../../services/analyticsService";
import Navbar from "../../components/Navbar";

function Dashboard() {
    const navigate = useNavigate();

    const {
        user,
        logout,
        resendVerification,
    } = useAuth();

    const [resendStatus, setResendStatus] = useState("");
    const [resending, setResending] = useState(false);

    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        avgResumeScore: 0,
        totalResumes: 0,
        avgPrepProgress: 0,
        streak: 0,
        level: 1,
        xp: 0,
        studyHours: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchStats = async () => {
        try {
            const interviewRes = await getInterviews();
            const analyticsRes = await getAnalytics().catch(() => null);

            const interviews = interviewRes.data.interviews || [];
            const completedCount = interviews.filter(i => i.status === "completed").length;
            const pendingCount = interviews.filter(i => i.status === "pending").length;

            if (analyticsRes && analyticsRes.data.success) {
                const data = analyticsRes.data.data;
                setStats({
                    total: interviews.length,
                    completed: completedCount,
                    pending: pendingCount,
                    avgResumeScore: data.stats.avgResumeScore || 0,
                    totalResumes: data.stats.totalResumes || 0,
                    avgPrepProgress: data.stats.avgPrepProgress || 0,
                    streak: data.stats.streak || user?.streak || 0,
                    level: data.stats.level || user?.level || 1,
                    xp: data.stats.xp || user?.xp || 0,
                    studyHours: data.stats.studyHours || 0
                });
            } else {
                setStats({
                    total: interviews.length,
                    completed: completedCount,
                    pending: pendingCount,
                    avgResumeScore: 0,
                    totalResumes: 0,
                    avgPrepProgress: 0,
                    streak: user?.streak || 0,
                    level: user?.level || 1,
                    xp: user?.xp || 0,
                    studyHours: Math.round(completedCount * 0.5)
                });
            }
        } catch (error) {
            console.error("Fetch dashboard stats error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setResendStatus("");

        const result = await resendVerification(
            user.email
        );

        setResending(false);

        setResendStatus(
            result.success
                ? "Verification email sent!"
                : result.error
        );
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />
            
            <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fadeIn">

                {/* Hero Header Card */}
                <div className="bg-white rounded-3xl shadow-lg p-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Placement Dashboard
                            </span>
                            <h1 className="text-4xl font-extrabold text-indigo-600 mt-2">
                                Welcome, {user?.name}
                            </h1>
                            <p className="text-gray-500 mt-1 font-medium">
                                Prepare. Practice. Perform. Track your interview readiness metrics below.
                            </p>
                        </div>

                        {/* Gamified stats badges */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-3 text-center">
                                <span className="text-sm font-bold text-indigo-600 uppercase block tracking-wider text-[10px]">Level</span>
                                <span className="text-2xl font-black text-indigo-600 mt-0.5 block">Lvl {loading ? "..." : stats.level}</span>
                            </div>
                            <div className="bg-orange-50 border border-orange-100 rounded-2xl px-5 py-3 text-center">
                                <span className="text-sm font-bold text-orange-600 uppercase block tracking-wider text-[10px]">Active Streak</span>
                                <span className="text-2xl font-black text-orange-500 mt-0.5 block">🔥 {loading ? "..." : stats.streak} Days</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-center">
                                <span className="text-sm font-bold text-slate-500 uppercase block tracking-wider text-[10px]">Study Hours</span>
                                <span className="text-2xl font-black text-slate-700 mt-0.5 block">⏳ {loading ? "..." : stats.studyHours} Hrs</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-3xl shadow-lg p-6">
                        <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider">Total Interviews</h3>
                        <p className="text-4xl font-black text-indigo-600 mt-2">
                            {loading ? "..." : stats.total}
                        </p>
                        <span className="text-[10px] text-gray-400 font-semibold mt-1 block">Completed: {stats.completed}</span>
                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-6">
                        <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider">Avg ATS Score</h3>
                        <p className="text-4xl font-black text-green-600 mt-2">
                            {loading ? "..." : `${stats.avgResumeScore}%`}
                        </p>
                        <span className="text-[10px] text-gray-400 font-semibold mt-1 block">{stats.totalResumes} Resumes analyzed</span>
                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-6">
                        <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider">Prep Syllabus Progress</h3>
                        <p className="text-4xl font-black text-orange-500 mt-2">
                            {loading ? "..." : `${stats.avgPrepProgress}%`}
                        </p>
                        <span className="text-[10px] text-gray-400 font-semibold mt-1 block">Based on Roadmap checklists</span>
                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-6">
                        <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider">Experience Level</h3>
                        <p className="text-xl font-black text-slate-700 mt-4 leading-tight">
                            {user?.experienceLevel || "Student"}
                        </p>
                        <span className="text-[10px] text-gray-400 font-semibold mt-1 block">Configured in Profile</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    
                    {/* Left Column: Quick Actions Hub */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                🚀 Prep Ninja Core Modules
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-4">
                                
                                {/* Start Mock Interview */}
                                <div
                                    onClick={() => navigate("/create-interview")}
                                    className="bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 p-5 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl mb-3">
                                        🎙️
                                    </div>
                                    <h3 className="font-bold text-gray-800">AI Mock Interview</h3>
                                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Practice coding, behavioral, or technical interviews with strict AI evaluations.</p>
                                </div>

                                {/* Resume Intelligence */}
                                <div
                                    onClick={() => navigate("/resume-intelligence")}
                                    className="bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 p-5 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-xl mb-3">
                                        📄
                                    </div>
                                    <h3 className="font-bold text-gray-800">Resume Intelligence</h3>
                                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Upload resume PDFs for detailed ATS scoring and missing skill checks.</p>
                                </div>

                                {/* AI Career Coach */}
                                <div
                                    onClick={() => navigate("/chatbot")}
                                    className="bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 p-5 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl mb-3">
                                        🤖
                                    </div>
                                    <h3 className="font-bold text-gray-800">AI Career Coach</h3>
                                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Consult the career assistant regarding syllabus concepts and planning.</p>
                                </div>

                                {/* AI Prep Hub */}
                                <div
                                    onClick={() => navigate("/preparation")}
                                    className="bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 p-5 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-xl mb-3">
                                        📚
                                    </div>
                                    <h3 className="font-bold text-gray-800">AI Preparation Hub</h3>
                                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Generate complete company-specific roadmaps, coding tasks, and quizzes.</p>
                                </div>

                                {/* Study Planner */}
                                <div
                                    onClick={() => navigate("/study-plan")}
                                    className="bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 p-5 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center text-xl mb-3">
                                        📅
                                    </div>
                                    <h3 className="font-bold text-gray-800">Weekly Planner</h3>
                                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Formulate weekly study lists and track milestones countdowns.</p>
                                </div>

                                {/* Leaderboards */}
                                <div
                                    onClick={() => navigate("/analytics")}
                                    className="bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 p-5 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center text-xl mb-3">
                                        🏆
                                    </div>
                                    <h3 className="font-bold text-gray-800">Leaderboard & Stats</h3>
                                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">Compare your XP ranking globally and check active progress charts.</p>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Right Column: Profile Info & Target Goals */}
                    <div className="md:col-span-1 space-y-6">
                        
                        {/* Profile Info Card */}
                        <div className="bg-white rounded-3xl shadow-lg p-6">
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Profile Goals
                                </h2>
                                <button
                                    onClick={() => navigate("/profile")}
                                    className="text-xs font-bold text-indigo-600 hover:underline"
                                >
                                    Customize &rarr;
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Candidate Name</span>
                                    <span className="text-sm font-semibold text-gray-700 block mt-0.5">{user?.name}</span>
                                </div>

                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Career Target Role</span>
                                    <span className="text-sm font-semibold text-slate-800 block mt-0.5">
                                        {user?.careerGoal || <span className="text-gray-400 italic">None specified</span>}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Target Company</span>
                                    <span className="text-sm font-semibold text-slate-800 block mt-0.5">
                                        {user?.targetCompany || <span className="text-gray-400 italic">None specified</span>}
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    {user?.isVerified ? (
                                        <p className="text-green-600 text-xs font-bold flex items-center gap-1">
                                            ✓ Email Verified
                                        </p>
                                    ) : (
                                        <div>
                                            <p className="text-yellow-600 text-xs font-bold flex items-center gap-1">
                                                ✗ Email Not Verified
                                            </p>

                                            <button
                                                onClick={handleResend}
                                                disabled={resending}
                                                className="text-indigo-600 hover:underline text-xs font-bold mt-2"
                                            >
                                                {resending
                                                    ? "Sending..."
                                                    : "Resend Verification Email"}
                                            </button>

                                            {resendStatus && (
                                                <p className="mt-2 text-xs text-gray-500">
                                                    {resendStatus}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Navigation Panel */}
                        <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
                            <h3 className="font-bold text-gray-800 text-base">Quick Shortcuts</h3>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => navigate("/history")}
                                    className="w-full text-left px-4 py-2.5 text-xs font-bold border border-slate-200 hover:bg-slate-50 rounded-xl transition text-gray-600"
                                >
                                    <i className="bi bi-clock-history mr-1.5 text-indigo-500"></i> Mock Interview History
                                </button>
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-4 py-2.5 text-xs font-bold border border-red-100 text-red-600 hover:bg-red-50 rounded-xl transition"
                                >
                                    <i className="bi bi-box-arrow-right mr-1.5"></i> Sign Out Account
                                </button>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default Dashboard;