import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import {
    getStudyPlan,
    generateStudyPlan,
    updateStudyPlan,
} from "../../services/studyPlanService";

function StudyPlanner() {
    const [studyPlan, setStudyPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [targetRole, setTargetRole] = useState("");
    const [timeline, setTimeline] = useState("4 Weeks");
    const [generating, setGenerating] = useState(false);
    
    const [expandedWeek, setExpandedWeek] = useState(0);
    const [toggling, setToggling] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");

    useEffect(() => {
        fetchStudyPlan();
    }, []);

    const fetchStudyPlan = async () => {
        try {
            const res = await getStudyPlan();
            if (res.data.success) {
                setStudyPlan(res.data.studyPlan);
            }
        } catch (error) {
            console.error("Fetch study plan error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!targetRole.trim()) return;

        setGenerating(true);
        setStatusMsg("");
        try {
            const res = await generateStudyPlan({
                targetRole: targetRole.trim(),
                timeline,
            });

            if (res.data.success) {
                setStudyPlan(res.data.studyPlan);
                setExpandedWeek(0);
            }
        } catch (error) {
            console.error("Generate study plan error:", error);
            setStatusMsg(error.response?.data?.message || "Failed to formulate weekly task sheets. Ensure your Gemini API credentials are set.");
        } finally {
            setGenerating(false);
        }
    };

    const handleToggleTask = async (weekIdx, taskIdx) => {
        if (toggling) return;
        setToggling(true);
        try {
            const res = await updateStudyPlan({
                weekIndex: weekIdx,
                taskIndex: taskIdx,
            });
            if (res.data.success) {
                setStudyPlan(res.data.studyPlan);
            }
        } catch (error) {
            console.error("Toggle task error:", error);
        } finally {
            setToggling(false);
        }
    };

    const handleToggleMilestone = async (mIdx) => {
        if (toggling) return;
        setToggling(true);
        try {
            const res = await updateStudyPlan({ milestoneIndex: mIdx });
            if (res.data.success) {
                setStudyPlan(res.data.studyPlan);
            }
        } catch (error) {
            console.error("Toggle milestone error:", error);
        } finally {
            setToggling(false);
        }
    };

    const getDaysLeft = (dateString) => {
        const milestoneDate = new Date(dateString);
        const today = new Date();
        milestoneDate.setHours(0,0,0,0);
        today.setHours(0,0,0,0);

        const diffTime = milestoneDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "Passed";
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "1 Day Left";
        return `${diffDays} Days Left`;
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

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            <div className="max-w-6xl mx-auto py-10 px-6">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                        📅 Study Planner
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Formulate week-by-week task checklists tailored to your target job profile, and check off study items.
                    </p>
                </div>

                {!studyPlan ? (
                    /* Setup Study Plan Form */
                    <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-xl mx-auto shadow-sm">
                        <span className="text-5xl block mb-4 text-center">🎯</span>
                        <h2 className="text-xl font-bold text-gray-800 text-center mb-1">Create Study Plan</h2>
                        <p className="text-gray-400 text-sm text-center mb-6">Specify your career goal role to receive custom weekly trackers.</p>

                        <form onSubmit={handleGenerate} className="space-y-4">
                            {statusMsg && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
                                    {statusMsg}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Target Job Role</label>
                                <input
                                    type="text"
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                    placeholder="e.g. React Frontend Engineer, Data Analyst"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-sm"
                                    required
                                    disabled={generating}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Timeline</label>
                                <select
                                    value={timeline}
                                    onChange={(e) => setTimeline(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-colors text-sm"
                                    disabled={generating}
                                >
                                    <option value="4 Weeks">4 Weeks (Crash course)</option>
                                    <option value="6 Weeks">6 Weeks (Standard timeline)</option>
                                    <option value="8 Weeks">8 Weeks (Comprehensive prep)</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={generating || !targetRole.trim()}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold py-3.5 px-6 rounded-xl transition disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                            >
                                {generating ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status"></span>
                                        <span>Mapping Schedule...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-calendar-event"></i>
                                        <span>Formulate Plan</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                ) : (
                    /* Study Plan Active Layout */
                    <div className="grid md:grid-cols-3 gap-8">
                        
                        {/* Weekly Checklists Column */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100 uppercase">
                                            Active Schedule
                                        </span>
                                        <h2 className="text-2xl font-black text-gray-800 mt-2">{studyPlan.targetRole}</h2>
                                        <p className="text-gray-400 text-xs font-medium mt-0.5">Timeline: {studyPlan.timeline}</p>
                                    </div>
                                    <div className="w-full sm:w-48">
                                        <div className="flex justify-between items-center text-xs text-gray-500 mb-1 font-semibold">
                                            <span>Progress:</span>
                                            <span>{studyPlan.progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${studyPlan.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Checklist accordion cards */}
                            {studyPlan.roadmap.map((week, wIdx) => {
                                const isExpanded = expandedWeek === wIdx;
                                const completedCount = week.tasks.filter(t => t.completed).length;
                                const totalCount = week.tasks.length;
                                
                                return (
                                    <div
                                        key={wIdx}
                                        className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm transition"
                                    >
                                        <button
                                            onClick={() => setExpandedWeek(isExpanded ? null : wIdx)}
                                            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/50 transition"
                                        >
                                            <div>
                                                <h3 className="font-extrabold text-gray-800 text-base">{week.title}</h3>
                                                <span className="text-xs text-gray-400 font-semibold mt-1 block">
                                                    Tasks Check: {completedCount} / {totalCount} completed
                                                </span>
                                            </div>
                                            <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'} text-gray-400`}></i>
                                        </button>

                                        {isExpanded && (
                                            <div className="px-6 pb-6 pt-2 border-t border-slate-100/50 space-y-3 animate-fadeIn">
                                                {week.tasks.map((task, tIdx) => (
                                                    <div
                                                        key={tIdx}
                                                        onClick={() => handleToggleTask(wIdx, tIdx)}
                                                        className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer hover:bg-slate-50/50 transition-colors ${
                                                            task.completed
                                                                ? "border-green-100 bg-green-50/10 text-gray-400"
                                                                : "border-slate-100 text-gray-700 bg-white"
                                                        }`}
                                                    >
                                                        <button
                                                            type="button"
                                                            className={`w-5 h-5 mt-0.5 shrink-0 rounded border flex items-center justify-center transition-all ${
                                                                task.completed
                                                                    ? "bg-green-600 border-green-600 text-white"
                                                                    : "border-slate-300 bg-white"
                                                            }`}
                                                        >
                                                            {task.completed && <i className="bi bi-check text-xs"></i>}
                                                        </button>
                                                        <span className={`text-sm ${task.completed ? "line-through" : ""}`}>
                                                            {task.text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Milestones Sidebar */}
                        <div className="md:col-span-1 space-y-4">
                            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                                <h3 className="font-extrabold text-gray-800 mb-4 flex items-center gap-1.5">
                                    <i className="bi bi-flag text-indigo-600"></i> Planner Milestones
                                </h3>

                                <div className="space-y-4">
                                    {studyPlan.milestones.map((m, mIdx) => {
                                        const dateStr = new Date(m.dueDate).toLocaleDateString(undefined, {
                                            month: "short",
                                            day: "numeric"
                                        });
                                        const daysLeft = getDaysLeft(m.dueDate);
                                        
                                        return (
                                            <div
                                                key={mIdx}
                                                onClick={() => handleToggleMilestone(mIdx)}
                                                className={`border rounded-2xl p-4 cursor-pointer hover:bg-slate-50/50 transition-colors flex items-start gap-3 ${
                                                    m.completed
                                                        ? "border-green-100 bg-green-50/5 opacity-60"
                                                        : "border-slate-100 bg-white"
                                                }`}
                                            >
                                                <button
                                                    type="button"
                                                    className={`w-5 h-5 mt-0.5 rounded-full border flex items-center justify-center shrink-0 transition ${
                                                        m.completed
                                                            ? "bg-green-600 border-green-600 text-white"
                                                            : "border-slate-300 bg-white"
                                                    }`}
                                                >
                                                    {m.completed && <i className="bi bi-check text-[10px]"></i>}
                                                </button>

                                                <div>
                                                    <h4 className={`text-sm font-bold ${m.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                        {m.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400 font-semibold">
                                                        <span>Due: {dateStr}</span>
                                                        {!m.completed && (
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                                                daysLeft === "Passed" ? "bg-red-50 text-red-500" :
                                                                daysLeft === "Today" ? "bg-orange-50 text-orange-500" :
                                                                "bg-indigo-50 text-indigo-600"
                                                            }`}>
                                                                {daysLeft}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Reset Button */}
                            <button
                                onClick={() => {
                                    if (window.confirm("Do you want to delete this study plan and formulate a new one? Your current progress will be lost.")) {
                                        setStudyPlan(null);
                                    }
                                }}
                                className="w-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-gray-500 font-bold py-3.5 px-4 rounded-2xl border border-slate-200/50 transition-all flex items-center justify-center gap-1.5 text-sm active:scale-[0.98]"
                            >
                                <i className="bi bi-arrow-counterclockwise"></i> Reformulate Planner
                            </button>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}

export default StudyPlanner;
