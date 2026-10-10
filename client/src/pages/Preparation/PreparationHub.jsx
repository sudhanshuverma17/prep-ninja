import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
    getSessions,
    generateSession,
} from "../../services/preparationService";

function PreparationHub() {
    const navigate = useNavigate();

    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState("Beginner");
    const [role, setRole] = useState("");
    const [company, setCompany] = useState("");
    const [generating, setGenerating] = useState(false);
    
    const [sessions, setSessions] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [statusMsg, setStatusMsg] = useState("");

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await getSessions();
            if (res.data.success) {
                setSessions(res.data.sessions || []);
            }
        } catch (error) {
            console.error("Fetch preps error:", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setGenerating(true);
        setStatusMsg("");

        try {
            const res = await generateSession({
                topic: topic.trim(),
                role: role.trim(),
                company: company.trim(),
                difficulty,
            });

            if (res.data.success) {
                // Navigate directly to the new session
                navigate(`/preparation/${res.data.session._id}`);
            }
        } catch (error) {
            console.error("Generate preparation error:", error);
            setStatusMsg(error.response?.data?.message || "Failed to generate preparation resources. Check your Gemini API connection.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-6xl mx-auto py-10 px-6">
                
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                            🧠 Preparation Hub
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Generate comprehensive, company-aligned study roadmaps, coding tasks, theory resources, and test quizzes using AI.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    
                    {/* Roadmap Generator Form */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Initialize Module</h2>
                            
                            <form onSubmit={handleGenerate} className="space-y-4">
                                {statusMsg && (
                                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
                                        {statusMsg}
                                    </div>
                                )}

                                {/* Topic */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject / Topic</label>
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g. Trees, React.js, OS"
                                        className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                        required
                                        disabled={generating}
                                    />
                                </div>

                                {/* Difficulty */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Difficulty</label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-colors"
                                        disabled={generating}
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>

                                {/* Target Company */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Target Company (Optional)</label>
                                    <input
                                        type="text"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        placeholder="e.g. Amazon, Google"
                                        className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                        disabled={generating}
                                    />
                                </div>

                                {/* Target Role */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Target Job Role (Optional)</label>
                                    <input
                                        type="text"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        placeholder="e.g. SDE-1, System Admin"
                                        className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                        disabled={generating}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={generating || !topic.trim()}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                                >
                                    {generating ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status"></span>
                                            <span>Building Syllabus...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-cpu"></i>
                                            <span>Generate Syllabus</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Preparation History List */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col h-full min-h-[400px]">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Active Study Modules</h2>

                            {loadingHistory ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="spinner-border text-indigo-600" role="status"></div>
                                </div>
                            ) : sessions.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                    <div className="text-5xl mb-3">📚</div>
                                    <p className="text-gray-400 text-sm italic max-w-sm">
                                        No preparation modules active yet. Enter a topic on the left to generate customized study plans.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4 flex-1 overflow-y-auto">
                                    {sessions.map((sess) => (
                                        <div
                                            key={sess._id}
                                            onClick={() => navigate(`/preparation/${sess._id}`)}
                                            className="bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-100 border border-slate-100 rounded-2xl p-5 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-extrabold text-gray-800 text-base line-clamp-1">{sess.topic}</h3>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                        sess.difficulty === "Advanced" ? "bg-red-50 text-red-600 border border-red-100" :
                                                        sess.difficulty === "Intermediate" ? "bg-yellow-50 text-yellow-600 border border-yellow-100" :
                                                        "bg-green-50 text-green-600 border border-green-100"
                                                    }`}>
                                                        {sess.difficulty}
                                                    </span>
                                                </div>

                                                {(sess.company || sess.role) && (
                                                    <p className="text-xs text-gray-400 mb-4 line-clamp-1 font-medium">
                                                        {sess.company && `Target: ${sess.company}`}
                                                        {sess.company && sess.role && " - "}
                                                        {sess.role && `${sess.role}`}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                {/* Progress bar */}
                                                <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                                                    <span>Completion:</span>
                                                    <span className="font-bold text-gray-800">{sess.progress}%</span>
                                                </div>
                                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                                        style={{ width: `${sess.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default PreparationHub;
