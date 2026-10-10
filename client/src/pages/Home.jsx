import { useNavigate } from "react-router-dom";
import logo from "../assets/prep-ninja-logo.png";

function Home() {
    const navigate = useNavigate();

    const features = [
        {
            icon: "🎙️",
            title: "AI Mock Interviews",
            description: "Practice real-time technical and behavioral interviews. Receive instant detailed scores, mistakes logs, and model answers."
        },
        {
            icon: "📄",
            title: "Resume Intelligence",
            description: "Check your resume against ATS tracking algorithms, extract skills, and receive actionable tips to fix deficiencies."
        },
        {
            icon: "🤖",
            title: "AI Career Coach",
            description: "A chat assistant to explain complex concepts, solve doubts, and generate targeted study roadmaps."
        },
        {
            icon: "🧠",
            title: "AI Prep Hub",
            description: "Generate comprehensive preparation roadmaps, study resources, coding tasks, and quizzes for any topic or company."
        },
        {
            icon: "📅",
            title: "Study Planner",
            description: "Personalized week-by-week planner checklists to keep your placement preparations organized and on track."
        },
        {
            icon: "🏆",
            title: "Leaderboard & Streaks",
            description: "Earn XP points and achievements, maintain daily active streaks, and compete with candidates globally."
        }
    ];

    const pricing = [
        {
            name: "Free Tier",
            price: "$0",
            period: "Forever",
            features: [
                "1 AI Mock Interview per week",
                "Basic Resume ATS Analysis",
                "Access to Career Chatbot",
                "Community Leaderboard"
            ],
            btnText: "Get Started",
            btnAction: () => navigate("/register"),
            popular: false
        },
        {
            name: "Pro Prep",
            price: "$19",
            period: "per month",
            features: [
                "Unlimited Mock Interviews",
                "Unlimited ATS Resume Checks",
                "Pro Company-Specific Roadmaps",
                "Custom Quiz Generators",
                "Priority AI Agent response",
                "Advanced progress analytics"
            ],
            btnText: "Upgrade to Pro",
            btnAction: () => navigate("/register"),
            popular: true
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">

            {/* Public Header/Navbar */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <img
                        src={logo}
                        alt="Prep Ninja"
                        className="h-8 w-auto object-contain cursor-pointer"
                        onClick={() => navigate("/")}
                    />
                    
                    <nav className="hidden md:flex gap-8 text-sm font-bold text-gray-500">
                        <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/login")}
                            className="text-xs font-bold text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-xl transition"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition hover:shadow-md hover:shadow-indigo-100"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-20 text-center md:py-28">
                <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest inline-block mb-4">
                    🚀 Prepare. Practice. Perform.
                </span>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
                    Master Your Technical and Behavioral Interviews
                </h1>
                <p className="text-gray-500 mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    Prep Ninja is an AI-powered preparation ecosystem that coaches you from resume scoring to mock interview readiness.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate("/register")}
                        className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold py-4 px-8 rounded-2xl transition shadow-lg shadow-indigo-100 text-base"
                    >
                        Start Preparing Free
                    </button>
                    <a
                        href="#features"
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-gray-600 font-bold py-4 px-8 rounded-2xl transition text-base flex items-center justify-center"
                    >
                        Explore Features
                    </a>
                </div>

                {/* Platform Summary Stats */}
                <div className="mt-20 border-t border-slate-200/60 pt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    <div>
                        <span className="text-3xl font-black text-indigo-600 block">98%</span>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mt-1">ATS Accuracy</span>
                    </div>
                    <div>
                        <span className="text-3xl font-black text-indigo-600 block">15,000+</span>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mt-1">Mocks Conducted</span>
                    </div>
                    <div>
                        <span className="text-3xl font-black text-indigo-600 block">4.9/5</span>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mt-1">Candidate Rating</span>
                    </div>
                    <div>
                        <span className="text-3xl font-black text-indigo-600 block">40%</span>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mt-1">Offer Rate Increase</span>
                    </div>
                </div>
            </section>

            {/* Core Features Cards Section */}
            <section id="features" className="bg-white border-y border-slate-200/50 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-slate-900">Comprehensive AI Interview Suite</h2>
                        <p className="text-gray-400 mt-2 font-medium">Everything you need to land your dream technology and business roles.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f, idx) => (
                            <div key={idx} className="border border-slate-100 bg-slate-50/20 p-8 rounded-3xl transition duration-300 hover:shadow-md">
                                <span className="text-4xl block mb-4">{f.icon}</span>
                                <h3 className="font-bold text-slate-800 text-lg">{f.title}</h3>
                                <p className="text-sm text-gray-500 mt-2.5 leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-slate-900">Simple, Transparent Pricing</h2>
                    <p className="text-gray-400 mt-2 font-medium">No hidden fees. Pick the tier that matches your career search intensity.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {pricing.map((p, idx) => (
                        <div
                            key={idx}
                            className={`bg-white rounded-3xl p-8 border shadow-sm flex flex-col justify-between ${
                                p.popular ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-slate-100"
                            }`}
                        >
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-black text-lg text-slate-800">{p.name}</h3>
                                    {p.popular && (
                                        <span className="bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                                            Recommended
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-black text-slate-900">{p.price}</span>
                                    <span className="text-xs text-gray-400 font-semibold">{p.period}</span>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {p.features.map((feat, fIdx) => (
                                        <li key={fIdx} className="text-sm text-gray-600 flex items-center gap-2">
                                            <span className="text-indigo-500">✓</span> {feat}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={p.btnAction}
                                className={`w-full py-3.5 rounded-2xl font-bold transition ${
                                    p.popular
                                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100"
                                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }`}
                            >
                                {p.btnText}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200/50 bg-white py-12 text-center text-xs text-gray-400 font-bold uppercase tracking-wider">
                <div className="max-w-7xl mx-auto px-6">
                    <img src={logo} alt="Prep Ninja" className="h-6 w-auto object-contain mx-auto mb-3" />
                    &copy; 2026 Prep Ninja AI-Powered Placement ecosystem. All rights reserved.
                </div>
            </footer>

        </div>
    );
}

export default Home;
