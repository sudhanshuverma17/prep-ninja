import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { getAnalytics, getAchievements } from "../../services/analyticsService";

function Analytics() {
    const [stats, setStats] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, achRes] = await Promise.all([
                getAnalytics(),
                getAchievements(),
            ]);

            if (statsRes.data.success) {
                setStats(statsRes.data.data);
            }
            if (achRes.data.success) {
                setAchievements(achRes.data.achievements || []);
                setLeaderboard(achRes.data.leaderboard || []);
            }
        } catch (error) {
            console.error("Fetch analytics data error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="spinner-border text-indigo-600" role="status"></div>
                </div>
            </div>
        );
    }

    const s = stats?.stats || {
        totalResumes: 0,
        avgResumeScore: 0,
        totalInterviews: 0,
        completedInterviews: 0,
        avgInterviewScore: 0,
        totalPrepSessions: 0,
        avgPrepProgress: 0,
        streak: 0,
        level: 1,
        xp: 0,
        studyHours: 0
    };

    const weeklyActivity = stats?.weeklyActivity || [];

    // Calculate maximum value in weekly activity to scale SVG bars
    const maxActivityCount = weeklyActivity.length > 0 
        ? Math.max(...weeklyActivity.map(d => d.count), 1)
        : 1;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            <div className="max-w-6xl mx-auto py-10 px-6">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                        📊 Progress & Gamification
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Review your interview readiness, track study hours, inspect achievements, and compare ranks on the global leaderboard.
                    </p>
                </div>

                {/* Gamified Stat Summary Banner */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl text-white p-8 mb-8 shadow-lg shadow-indigo-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-5">
                        <div className="relative w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-4xl border border-white/20">
                            👑
                            <div className="absolute -bottom-2.5 bg-yellow-400 text-slate-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-indigo-600 uppercase">
                                Level {s.level}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black">{stats?.user?.name || "Student"}</h2>
                            <p className="text-indigo-200 text-sm mt-0.5">Ranked candidate in Prep Ninja Placement Hub</p>
                            
                            {/* XP Progress Bar */}
                            <div className="mt-3 w-48 sm:w-64">
                                <div className="flex justify-between text-[10px] text-indigo-200 mb-1 font-semibold">
                                    <span>XP PROGRESS</span>
                                    <span>{s.xp % 100}/100 XP</span>
                                </div>
                                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${s.xp % 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <div className="bg-white/10 border border-white/10 rounded-2xl px-6 py-3 text-center">
                            <span className="text-2xl block">🔥</span>
                            <span className="text-2xl font-black block mt-0.5">{s.streak} Days</span>
                            <span className="text-[10px] text-indigo-200 font-bold uppercase tracking-wide">Daily Streak</span>
                        </div>
                        <div className="bg-white/10 border border-white/10 rounded-2xl px-6 py-3 text-center">
                            <span className="text-2xl block">⏳</span>
                            <span className="text-2xl font-black block mt-0.5">{s.studyHours} Hrs</span>
                            <span className="text-[10px] text-indigo-200 font-bold uppercase tracking-wide">Study Invested</span>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    
                    {/* Left: Score Metrics & Weekly Activity SVG Chart */}
                    <div className="md:col-span-2 space-y-6">
                        
                        {/* Summary Metrics Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                                <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                                    📁
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 font-bold block uppercase tracking-wider">Avg ATS Score</span>
                                    <span className="text-2xl font-black text-gray-800 mt-1 block">{s.avgResumeScore}%</span>
                                    <span className="text-[10px] text-gray-400 font-semibold">{s.totalResumes} Resumes analyzed</span>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                                <div className="w-14 h-14 bg-green-50 border border-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                                    🤝
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 font-bold block uppercase tracking-wider">Avg Mock Score</span>
                                    <span className="text-2xl font-black text-gray-800 mt-1 block">{s.avgInterviewScore}/10</span>
                                    <span className="text-[10px] text-gray-400 font-semibold">{s.completedInterviews} completed sessions</span>
                                </div>
                            </div>
                        </div>

                        {/* Custom SVG Weekly Activity Bar Chart */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                            <h3 className="font-extrabold text-gray-800 mb-6 flex items-center gap-1.5 text-base">
                                📈 Weekly Activity Logs
                            </h3>
                            
                            {/* Responsive SVG Container */}
                            <div className="relative w-full h-48 flex items-end justify-between px-4 pb-4">
                                {/* Grid lines background */}
                                <div className="absolute inset-x-0 bottom-4 top-0 border-b border-slate-100 flex flex-col justify-between pointer-events-none">
                                    <div className="w-full border-t border-slate-100/50"></div>
                                    <div className="w-full border-t border-slate-100/50"></div>
                                    <div className="w-full border-t border-slate-100/50"></div>
                                </div>

                                {weeklyActivity.map((dayData, idx) => {
                                    // Scale height (max 80% to fit tags)
                                    const pctHeight = (dayData.count / maxActivityCount) * 80;
                                    
                                    return (
                                        <div key={idx} className="flex-1 flex flex-col items-center group relative z-10">
                                            {/* Count tooltips */}
                                            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded transition font-bold">
                                                {dayData.count} actions
                                            </div>

                                            {/* Bar pillar */}
                                            <div
                                                className="bg-indigo-600 hover:bg-indigo-500 w-8 sm:w-10 rounded-t-lg transition-all duration-500 cursor-pointer shadow-sm shadow-indigo-100"
                                                style={{ height: `${Math.max(pctHeight, 6)}%` }}
                                            />

                                            {/* Label */}
                                            <span className="text-xs text-gray-400 font-bold mt-2 uppercase tracking-wide">
                                                {dayData.day}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Achievements unlocked tray */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                            <h3 className="font-extrabold text-gray-800 mb-6 flex items-center gap-1.5 text-base">
                                🎖️ Unlocked Badges ({achievements.length})
                            </h3>

                            {achievements.length === 0 ? (
                                <p className="text-gray-400 text-sm italic text-center py-6">
                                    No badges unlocked yet. Complete mock tests or study roadmaps to earn points!
                                </p>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {achievements.map((ach) => (
                                        <div key={ach._id} className="border border-slate-100 bg-slate-50/30 rounded-2xl p-4 flex gap-3 items-center">
                                            <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 border border-yellow-200 flex items-center justify-center text-xl shrink-0">
                                                🏆
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-sm">{ach.title}</h4>
                                                <p className="text-xs text-gray-400 mt-0.5 leading-snug">{ach.description}</p>
                                                <span className="inline-block mt-1.5 text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-md">
                                                    +{ach.points} XP
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right: Global XP Leaderboard */}
                    <div className="md:col-span-1">
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm h-full flex flex-col">
                            <h3 className="font-extrabold text-gray-800 mb-4 flex items-center gap-1.5 text-base">
                                👑 Global Leaderboard
                            </h3>
                            <p className="text-gray-400 text-xs mb-6 font-medium">Rankings calculated by total XP points.</p>

                            <div className="space-y-3 flex-1 overflow-y-auto">
                                {leaderboard.map((user, idx) => {
                                    const isSelf = user.email === stats?.user?.email;
                                    
                                    return (
                                        <div
                                            key={user._id}
                                            className={`flex items-center justify-between p-3.5 rounded-2xl border transition ${
                                                isSelf
                                                    ? "bg-indigo-50 border-indigo-100 shadow-sm"
                                                    : "bg-white border-slate-100/50 hover:bg-slate-50/50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Rank position numbers */}
                                                <span className={`w-6 text-center font-extrabold text-sm ${
                                                    idx === 0 ? "text-yellow-500 text-lg" :
                                                    idx === 1 ? "text-slate-400 text-base" :
                                                    idx === 2 ? "text-amber-600 text-base" :
                                                    "text-gray-400"
                                                }`}>
                                                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                                                </span>

                                                <div>
                                                    <h4 className={`text-sm font-bold flex items-center gap-1.5 ${
                                                        isSelf ? "text-indigo-900" : "text-gray-800"
                                                    }`}>
                                                        {user.name}
                                                        {isSelf && (
                                                            <span className="bg-indigo-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                                                                You
                                                            </span>
                                                        )}
                                                    </h4>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 block">
                                                        Level {user.level || 1}
                                                    </span>
                                                </div>
                                            </div>

                                            <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                                                isSelf ? "bg-indigo-200 text-indigo-800" : "bg-slate-100 text-slate-700"
                                            }`}>
                                                {user.xp} XP
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Analytics;
