import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
    getSession,
    markQuestionComplete,
    startQuiz,
} from "../../services/preparationService";

function PreparationSession() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [session, setSession] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [quiz, setQuiz] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("roadmap");
    const [questionTab, setQuestionTab] = useState("THEORY");
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [togglingId, setTogglingId] = useState(null);
    const [quizGenerating, setQuizGenerating] = useState(false);

    useEffect(() => {
        fetchSessionDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchSessionDetails = async () => {
        try {
            const res = await getSession(id);
            if (res.data.success) {
                setSession(res.data.session);
                setQuestions(res.data.questions || []);
                setQuiz(res.data.quiz || null);
            }
        } catch (error) {
            console.error("Fetch session detail error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleQuestion = async (qId) => {
        setTogglingId(qId);
        try {
            const res = await markQuestionComplete(qId);
            if (res.data.success) {
                // Update local question list
                setQuestions(prev => prev.map(q => q._id === qId ? res.data.question : q));
                // Update progress in session
                setSession(prev => ({ ...prev, progress: res.data.progress }));
            }
        } catch (error) {
            console.error("Toggle question error:", error);
        } finally {
            setTogglingId(null);
        }
    };

    const handleStartQuiz = async () => {
        setQuizGenerating(true);
        try {
            const res = await startQuiz(id);
            if (res.data.success) {
                // Navigate to quiz solver route
                navigate(`/preparation/${id}/quiz`);
            }
        } catch (error) {
            console.error("Start quiz error:", error);
            alert("Failed to start quiz. Make sure your Gemini API key is configured.");
        } finally {
            setQuizGenerating(false);
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

    if (!session) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <span className="text-5xl mb-4">⚠️</span>
                    <h2 className="text-xl font-bold text-gray-800">Session Not Found</h2>
                    <button onClick={() => navigate("/preparation")} className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-xl">
                        Back to Hub
                    </button>
                </div>
            </div>
        );
    }

    const filteredQuestions = questions.filter(q => q.type === questionTab);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            <div className="max-w-5xl mx-auto py-10 px-6">
                
                {/* Back Link */}
                <button
                    onClick={() => navigate("/preparation")}
                    className="text-gray-500 hover:text-indigo-600 text-sm font-semibold mb-6 flex items-center gap-1 bg-white border border-slate-100 hover:border-indigo-100 px-4 py-2 rounded-xl shadow-sm transition"
                >
                    &larr; Back to Preparation Hub
                </button>

                {/* Session Header Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100 uppercase">
                                {session.difficulty} Module
                            </span>
                            <h1 className="text-3xl font-extrabold text-gray-900 mt-2">{session.topic}</h1>
                            {(session.company || session.role) && (
                                <p className="text-gray-500 mt-1 text-sm font-medium">
                                    {session.company && `Target Company: ${session.company}`}
                                    {session.company && session.role && " • "}
                                    {session.role && `Target Role: ${session.role}`}
                                </p>
                            )}
                        </div>

                        {/* Session Progress Block */}
                        <div className="w-full md:w-60 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                                <span className="font-semibold">Module Progress:</span>
                                <span className="font-extrabold text-indigo-600">{session.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${session.progress}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-slate-100 gap-2">
                        <button
                            onClick={() => setActiveTab("roadmap")}
                            className={`pb-3.5 px-4 font-bold text-sm border-b-2 transition ${
                                activeTab === "roadmap"
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            <i className="bi bi-map mr-1.5"></i> Learning Roadmap
                        </button>
                        <button
                            onClick={() => setActiveTab("questions")}
                            className={`pb-3.5 px-4 font-bold text-sm border-b-2 transition ${
                                activeTab === "questions"
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            <i className="bi bi-question-circle mr-1.5"></i> Practice Questions
                        </button>
                        <button
                            onClick={() => setActiveTab("quiz")}
                            className={`pb-3.5 px-4 font-bold text-sm border-b-2 transition ${
                                activeTab === "quiz"
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            <i className="bi bi-award mr-1.5"></i> Topic Quiz
                        </button>
                    </div>
                </div>

                {/* Tab 1: Learning Roadmap */}
                {activeTab === "roadmap" && (
                    <div className="space-y-6">
                        <div className="relative border-l-2 border-indigo-100 ml-4 pl-8 space-y-8 py-2">
                            {session.roadmap.map((item, index) => (
                                <div key={index} className="relative">
                                    {/* Timeline dot */}
                                    <div className="absolute -left-[41px] top-1 bg-white border-2 border-indigo-600 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-indigo-600 shadow-sm">
                                        {index + 1}
                                    </div>
                                    
                                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">{item.phase}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.description}</p>
                                        
                                        {item.resources && item.resources.length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Suggested Resources</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.resources.map((res, rIdx) => (
                                                        <span
                                                            key={rIdx}
                                                            className="bg-indigo-50 border border-indigo-100/50 text-indigo-600 text-xs px-3 py-1 rounded-full font-medium"
                                                        >
                                                            {res}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab 2: Practice Questions */}
                {activeTab === "questions" && (
                    <div className="space-y-6">
                        {/* Subtabs filter */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {["THEORY", "CODING", "INTERVIEW", "BEHAVIORAL"].map(type => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setQuestionTab(type);
                                        setExpandedQuestion(null);
                                    }}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                                        questionTab === type
                                            ? "bg-slate-800 text-white border-slate-800"
                                            : "bg-white text-gray-500 border-slate-100 hover:bg-slate-50"
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        {filteredQuestions.length === 0 ? (
                            <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center text-gray-400 text-sm italic shadow-sm">
                                No questions found in this category.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredQuestions.map((q) => (
                                    <div
                                        key={q._id}
                                        className={`bg-white border rounded-3xl p-6 shadow-sm transition-all duration-300 ${
                                            q.completed ? "border-green-100 bg-green-50/10" : "border-slate-100"
                                        }`}
                                    >
                                        <div className="flex items-start gap-4 justify-between">
                                            <div className="flex items-start gap-3">
                                                <button
                                                    onClick={() => handleToggleQuestion(q._id)}
                                                    disabled={togglingId === q._id}
                                                    className={`w-6 h-6 mt-1 flex items-center justify-center rounded-lg border transition ${
                                                        q.completed
                                                            ? "bg-green-600 border-green-600 text-white"
                                                            : "border-slate-300 hover:border-indigo-600 bg-white"
                                                    }`}
                                                >
                                                    {q.completed && <i className="bi bi-check-lg text-sm"></i>}
                                                </button>

                                                <div>
                                                    <h3 className={`font-bold text-gray-800 text-base ${q.completed ? 'line-through text-gray-400' : ''}`}>
                                                        {q.title}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm mt-1">{q.description}</p>
                                                    
                                                    {/* Badges metadata */}
                                                    <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                                                        <span className={`px-2 py-0.5 rounded-md font-semibold ${
                                                            q.difficulty === "Hard" ? "bg-red-50 text-red-600" :
                                                            q.difficulty === "Medium" ? "bg-yellow-50 text-yellow-600" :
                                                            "bg-green-50 text-green-600"
                                                        }`}>
                                                            {q.difficulty}
                                                        </span>
                                                        <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-semibold">
                                                            {q.source}
                                                        </span>
                                                        {q.url && (
                                                            <a
                                                                href={q.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-indigo-600 hover:underline inline-flex items-center gap-1 font-semibold"
                                                            >
                                                                Solve External <i className="bi bi-box-arrow-up-right text-[10px]"></i>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expand toggler for AI answer */}
                                            {q.correctAnswer && (
                                                <button
                                                    onClick={() => setExpandedQuestion(expandedQuestion === q._id ? null : q._id)}
                                                    className="bg-slate-50 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 w-9 h-9 rounded-xl flex items-center justify-center transition border border-slate-100"
                                                >
                                                    <i className={`bi ${expandedQuestion === q._id ? 'bi-chevron-up' : 'bi-chevron-down'} text-sm`}></i>
                                                </button>
                                            )}
                                        </div>

                                        {/* Expanded Answer Section */}
                                        {expandedQuestion === q._id && q.correctAnswer && (
                                            <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-gray-600 bg-slate-50 rounded-2xl p-4 animate-fadeIn">
                                                <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                                                    💡 AI Solution/Hint:
                                                </h4>
                                                <p className="leading-relaxed whitespace-pre-wrap">{q.correctAnswer}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 3: Topic Quiz */}
                {activeTab === "quiz" && (
                    <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center max-w-xl mx-auto shadow-sm">
                        <span className="text-5xl mb-4 block">📝</span>
                        <h3 className="text-xl font-bold text-gray-800">Check Your Knowledge</h3>
                        
                        {quiz && quiz.completed ? (
                            <div className="mt-4">
                                <p className="text-gray-500 mb-6 text-sm">
                                    You completed the multiple-choice quiz for this topic.
                                </p>
                                <div className="inline-block bg-indigo-50 border border-indigo-100 rounded-2xl px-8 py-4 mb-6 shadow-sm">
                                    <span className="text-xs text-gray-400 font-bold block uppercase tracking-widest">Your Score</span>
                                    <span className="text-4xl font-black text-indigo-600 mt-1 block">{quiz.score}%</span>
                                </div>
                                
                                <button
                                    onClick={handleStartQuiz}
                                    disabled={quizGenerating}
                                    className="w-full bg-slate-800 hover:bg-slate-900 active:scale-[0.98] text-white font-bold py-3 px-6 rounded-2xl transition"
                                >
                                    {quizGenerating ? "Generating New Quiz..." : "Retake Quiz Test"}
                                </button>
                            </div>
                        ) : quiz && !quiz.completed ? (
                            <div>
                                <p className="text-gray-500 mb-6 text-sm">
                                    You have a generated quiz waiting. Continue to solve the multiple-choice test.
                                </p>
                                <button
                                    onClick={() => navigate(`/preparation/${id}/quiz`)}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold py-3.5 px-6 rounded-2xl transition shadow-md shadow-indigo-100"
                                >
                                    Resume Quiz Practice &rarr;
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                                    Take a 5-question multiple-choice practice quiz customized by AI to reinforce your learning and earn up to 50 XP points!
                                </p>
                                <button
                                    onClick={handleStartQuiz}
                                    disabled={quizGenerating}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold py-3.5 px-6 rounded-2xl transition shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
                                >
                                    {quizGenerating ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status"></span>
                                            <span>Formulating Questions...</span>
                                        </>
                                    ) : (
                                        <span>Start Practice Quiz</span>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

export default PreparationSession;
