import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchResumeHistory,
    fetchResumeDetails,
    uploadResumeAction,
    deleteResumeAction,
    clearCurrentAnalysis,
} from "../../redux/slices/resumeSlice.js";
import {
    Upload,
    FileText,
    Trash2,
    Briefcase,
    Code,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    Plus,
    ChevronRight,
    Loader2,
    Calendar,
    Award,
    Sparkles,
    Eye
} from "lucide-react";
import { API_BASE_URL } from "../../config/api";
import Navbar from "../../components/Navbar.jsx";

export default function ResumeIntelligence() {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    // State from Redux
    const { history, currentAnalysis, loading, uploading, error } = useSelector(
        (state) => state.resumes
    );

    // Local UI states
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [targetRole, setTargetRole] = useState("");
    const [targetDescription, setTargetDescription] = useState("");
    const [activeTab, setActiveTab] = useState("all"); // "all", "skills", "experience", "projects", "feedback"
    const [uploadStep, setUploadStep] = useState(0);

    // Load history on mount
    useEffect(() => {
        dispatch(fetchResumeHistory());
    }, [dispatch]);

    // Simulated progress steps for the loader during analysis
    useEffect(() => {
        let interval;
        if (uploading) {
            setUploadStep(0);
            interval = setInterval(() => {
                setUploadStep((prev) => {
                    if (prev < 3) return prev + 1;
                    return prev;
                });
            }, 3000);
        } else {
            setUploadStep(0);
        }
        return () => clearInterval(interval);
    }, [uploading]);

    const processingSteps = [
        "Reading and uploading PDF document...",
        "Parsing resume text extraction...",
        "Analyzing skills, experience, and projects using Gemini AI...",
        "Calculating ATS score and generating career recommendations..."
    ];

    // File Drag handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf") {
                setFile(droppedFile);
            } else {
                alert("Only PDF files are supported.");
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    // Form submission
    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("resume", file);
        formData.append("targetRole", targetRole);
        formData.append("targetDescription", targetDescription);

        await dispatch(uploadResumeAction(formData));
        // Reset local form states
        setFile(null);
        setTargetRole("");
        setTargetDescription("");
    };

    // Selecting a past record
    const handleSelectResume = (id) => {
        dispatch(fetchResumeDetails(id));
    };

    // Deleting a record
    const handleDeleteResume = (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this analysis report?")) {
            dispatch(deleteResumeAction(id));
        }
    };

    const handleNewUploadClick = () => {
        dispatch(clearCurrentAnalysis());
    };

    // Color mapper for ATS score
    const getScoreColor = (score) => {
        if (score >= 80) return "text-emerald-500 stroke-emerald-500 border-emerald-200 bg-emerald-50";
        if (score >= 60) return "text-amber-500 stroke-amber-500 border-amber-200 bg-amber-50";
        return "text-rose-500 stroke-rose-500 border-rose-200 bg-rose-50";
    };



    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />

            <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto p-4 md:p-6 gap-6 overflow-hidden">
                
                {/* Left Sidebar - Resume History */}
                <div className="w-full lg:w-80 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 p-4 shrink-0 max-h-[calc(100vh-120px)] lg:sticky lg:top-20">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            History
                        </h2>
                        <button
                            onClick={handleNewUploadClick}
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-2 rounded-xl transition flex items-center gap-1 text-sm font-medium"
                            title="Upload new resume"
                        >
                            <Plus className="w-4 h-4" />
                            New
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {loading && history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mb-2" />
                                <span className="text-xs text-slate-400">Loading history...</span>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <FileText className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                                <p className="text-sm font-medium text-slate-400">No resumes analyzed yet</p>
                                <p className="text-xs text-slate-300 mt-1">Upload a PDF resume to get started</p>
                            </div>
                        ) : (
                            history.map((item) => {
                                const isSelected = currentAnalysis?._id === item._id;
                                return (
                                    <div
                                        key={item._id}
                                        onClick={() => handleSelectResume(item._id)}
                                        className={`group relative p-3 rounded-2xl cursor-pointer border transition-all duration-250 flex items-center gap-3 ${
                                            isSelected
                                                ? "bg-indigo-50/75 border-indigo-200 shadow-sm"
                                                : "bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200"
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold ${
                                            item.atsScore >= 80
                                                ? "bg-emerald-50 text-emerald-600"
                                                : item.atsScore >= 60
                                                ? "bg-amber-50 text-amber-600"
                                                : "bg-rose-50 text-rose-600"
                                        }`}>
                                            {item.atsScore}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-700 truncate">
                                                {item.targetRole || "General Analysis"}
                                            </p>
                                            <p className="text-[11px] text-slate-400">
                                                {new Date(item.createdAt).toLocaleDateString(undefined, {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => handleDeleteResume(e, item._id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                                                title="Delete analysis report"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Side - Analysis Dashboard or File Upload Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    
                    {/* Error Alerts */}
                    {error && (
                        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-2xl mb-6 flex items-start gap-3 shadow-sm">
                            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-rose-800">Analysis Error</h4>
                                <p className="text-xs text-rose-700 mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Loader during Gemini Analysis processing */}
                    {uploading ? (
                        <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col items-center justify-center min-h-[500px]">
                            <div className="relative mb-6">
                                <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                <Sparkles className="w-8 h-8 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 text-center animate-pulse">
                                Resume Intelligence Processing
                            </h3>
                            <p className="text-sm text-slate-500 mt-2 text-center max-w-md">
                                Please wait while our system parses the PDF and utilizes Google Gemini AI to analyze your profile matches.
                            </p>

                            <div className="mt-8 w-full max-w-sm bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-indigo-600 h-1.5 rounded-full transition-all duration-700"
                                    style={{ width: `${(uploadStep + 1) * 25}%` }}
                                ></div>
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-indigo-600">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>{processingSteps[uploadStep]}</span>
                            </div>
                        </div>
                    ) : !currentAnalysis ? (
                        
                        /* Upload Form / Interface */
                        <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
                            <div className="mb-6">
                                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                                    <Sparkles className="w-7 h-7 text-indigo-600" />
                                    Resume Intelligence Module
                                </h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    Upload your resume PDF to calculate your ATS match score, extract key skills/projects, and identify gaps for target job applications.
                                </p>
                            </div>

                            <form onSubmit={handleAnalyze} className="space-y-6">
                                
                                {/* Drag & Drop Area */}
                                <div
                                    onDragEnter={handleDrag}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={handleUploadClick}
                                    className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center group ${
                                        dragActive
                                            ? "border-indigo-500 bg-indigo-50/20"
                                            : file
                                            ? "border-emerald-500 bg-emerald-50/10"
                                            : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50"
                                    }`}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept=".pdf"
                                        className="hidden"
                                    />

                                    {file ? (
                                        <>
                                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm mb-4">
                                                <FileText className="w-8 h-8" />
                                            </div>
                                            <h4 className="text-base font-bold text-slate-700">{file.name}</h4>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Format Selected
                                            </p>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFile(null);
                                                }}
                                                className="mt-4 text-xs font-semibold text-rose-500 hover:underline hover:text-rose-600"
                                            >
                                                Change File
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-250 mb-4">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                            <h4 className="text-base font-bold text-slate-700">
                                                Drag & drop your resume PDF here
                                            </h4>
                                            <p className="text-xs text-slate-400 mt-1">
                                                or <span className="text-indigo-600 font-semibold underline">browse file</span> from computer
                                            </p>
                                            <p className="text-[10px] text-slate-300 mt-3">
                                                PDF format only • Max file size: 10MB
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Custom target job matching parameters (premium touch) */}
                                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
                                        <Award className="w-4.5 h-4.5 text-indigo-600" />
                                        Target Job Customization (Optional)
                                    </h3>
                                    <p className="text-xs text-slate-400 mb-4">
                                        Providing a target job title or job description helps Gemini tailor the ATS scoring, detect specific missing skills, and give custom recommendations.
                                    </p>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                                Target Job Title
                                            </label>
                                            <input
                                                type="text"
                                                value={targetRole}
                                                onChange={(e) => setTargetRole(e.target.value)}
                                                placeholder="e.g. Senior Frontend Developer, Data Analyst"
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                                Job Description / Core Requirements
                                            </label>
                                            <textarea
                                                rows="4"
                                                value={targetDescription}
                                                onChange={(e) => setTargetDescription(e.target.value)}
                                                placeholder="Paste the key job description bullet points or responsibilities here..."
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!file}
                                    className={`w-full py-4 rounded-xl font-bold text-white shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
                                        file
                                            ? "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-[0.99]"
                                            : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                    }`}
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Analyze Resume with Gemini AI
                                </button>
                            </form>
                        </div>
                    ) : (
                        
                        /* Analysis Report Dashboard */
                        <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-4 md:p-6 flex flex-col min-h-0 overflow-y-auto">
                            
                            {/* Dashboard Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5 mb-5">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                            Analysis Report
                                        </span>
                                        {currentAnalysis.targetRole && (
                                            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full truncate max-w-xs">
                                                Target: {currentAnalysis.targetRole}
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-xl md:text-2xl font-bold text-slate-800 mt-2 flex items-center gap-2">
                                        <FileText className="w-6 h-6 text-indigo-600" />
                                        Resume Score Breakdown
                                    </h1>
                                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                        <span>Analyzed on {new Date(currentAnalysis.createdAt).toLocaleString()}</span>
                                        <span>•</span>
                                        <a
                                            href={`${API_BASE_URL}${currentAnalysis.resumeUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:underline flex items-center gap-0.5"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> View PDF
                                        </a>
                                    </p>
                                </div>
                                <button
                                    onClick={handleNewUploadClick}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md transition flex items-center gap-1.5"
                                >
                                    <Plus className="w-4 h-4" />
                                    New Upload
                                </button>
                            </div>

                            {/* Top row: Score Gauge and AI Feedback Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                                
                                {/* ATS Score Gauge Card */}
                                <div className={`md:col-span-4 rounded-3xl border p-5 flex flex-col items-center justify-center text-center relative overflow-hidden ${getScoreColor(currentAnalysis.atsScore)}`}>
                                    <div className="relative w-28 h-28 flex items-center justify-center mb-3">
                                        {/* Circular progress bar SVG */}
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="56"
                                                cy="56"
                                                r={radius}
                                                className="stroke-slate-100 fill-none"
                                                strokeWidth="8"
                                            />
                                            <circle
                                                cx="56"
                                                cy="56"
                                                r={radius}
                                                className="fill-none transition-all duration-1000 ease-out"
                                                strokeWidth="8"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={circumference - (currentAnalysis.atsScore / 100) * circumference}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center justify-center">
                                            <span className="text-3xl font-extrabold text-slate-800">{currentAnalysis.atsScore}</span>
                                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">ATS Score</span>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-sm font-bold text-slate-800 mt-1">
                                        {currentAnalysis.atsScore >= 80
                                            ? "Strong Candidate Match"
                                            : currentAnalysis.atsScore >= 60
                                            ? "Good Match with Gaps"
                                            : "Needs Refactoring"}
                                    </h3>
                                    <p className="text-xs text-slate-500 max-w-xs mt-1 text-center leading-relaxed">
                                        Your resume has a {currentAnalysis.atsScore}% match strength for the target configurations.
                                    </p>
                                </div>

                                {/* Quick AI Feedback Card */}
                                <div className="md:col-span-8 bg-slate-50 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
                                            <Sparkles className="w-4.5 h-4.5 text-indigo-500 animate-pulse" />
                                            AI Executive Feedback
                                        </h3>
                                        <p className="text-xs text-slate-600 leading-relaxed italic">
                                            "{currentAnalysis.feedback}"
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100">
                                        <TrendingUp className="w-5 h-5 text-indigo-600 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-700">Optimization Goal</p>
                                            <p className="text-[11px] text-slate-500 truncate">
                                                {currentAnalysis.missingSkills?.length > 0
                                                    ? `Incorporate ${currentAnalysis.missingSkills[0]} and other missing skills to raise your score.`
                                                    : "Your core skills align nicely! Highlight achievements."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section Navigation Tabs */}
                            <div className="flex border-b border-slate-100 mb-6 overflow-x-auto gap-2">
                                {[
                                    { id: "all", label: "Overview" },
                                    { id: "skills", label: "Skills Gap" },
                                    { id: "experience", label: "Experience" },
                                    { id: "projects", label: "Projects" }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-2.5 px-4 font-semibold text-xs rounded-t-xl transition-all border-b-2 shrink-0 ${
                                            activeTab === tab.id
                                                ? "text-indigo-600 border-indigo-600 bg-indigo-50/50"
                                                : "text-slate-400 border-transparent hover:text-slate-600"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Details */}
                            <div className="flex-1 min-h-[300px]">
                                
                                {/* Overview Tab */}
                                {activeTab === "all" && (
                                    <div className="space-y-6">
                                        {/* Skills Section Summary */}
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                                                <Code className="w-4 h-4 text-indigo-600" />
                                                Core & Target Skills Comparison
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Extracted skills */}
                                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Extracted Skills ({currentAnalysis.extractedSkills?.length})
                                                    </h4>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {currentAnalysis.extractedSkills?.map((skill, i) => (
                                                            <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg font-medium border border-emerald-100">
                                                                {skill}
                                                            </span>
                                                        )) || <span className="text-xs text-slate-400">None detected</span>}
                                                    </div>
                                                </div>

                                                {/* Missing skills */}
                                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                                                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Detected Gaps ({currentAnalysis.missingSkills?.length})
                                                    </h4>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {currentAnalysis.missingSkills?.map((skill, i) => (
                                                            <span key={i} className="text-xs bg-rose-50 text-rose-700 px-2.5 py-1 rounded-lg font-medium border border-rose-100">
                                                                {skill}
                                                            </span>
                                                        )) || <span className="text-xs text-slate-400">Perfect match! No gaps found.</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Brief Experience & Projects list */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Experience snippet */}
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                                                    <Briefcase className="w-4 h-4 text-indigo-600" />
                                                    Experience Summary
                                                </h3>
                                                <div className="space-y-3">
                                                    {currentAnalysis.extractedExperience?.slice(0, 2).map((exp, i) => (
                                                        <div key={i} className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
                                                            <h4 className="text-xs font-bold text-slate-800">{exp.role}</h4>
                                                            <p className="text-[11px] text-indigo-600 font-medium mt-0.5">{exp.company} • {exp.duration}</p>
                                                            <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2">{exp.description}</p>
                                                        </div>
                                                    )) || <p className="text-xs text-slate-400">No experience parsed.</p>}
                                                </div>
                                            </div>

                                            {/* Projects snippet */}
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                                                    <Code className="w-4 h-4 text-indigo-600" />
                                                    Key Projects parsed
                                                </h3>
                                                <div className="space-y-3">
                                                    {currentAnalysis.extractedProjects?.slice(0, 2).map((proj, i) => (
                                                        <div key={i} className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
                                                            <h4 className="text-xs font-bold text-slate-800">{proj.title}</h4>
                                                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{proj.description}</p>
                                                            {proj.technologies?.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mt-2">
                                                                    {proj.technologies.slice(0, 3).map((t, idx) => (
                                                                        <span key={idx} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                                                            {t}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )) || <p className="text-xs text-slate-400">No projects parsed.</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Skills Gap Tab */}
                                {activeTab === "skills" && (
                                    <div className="space-y-6">
                                        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-3">
                                                <Code className="w-4.5 h-4.5 text-emerald-500" />
                                                Verified Resume Skills
                                            </h3>
                                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                                These skills are explicitly mentioned or strongly inferred in your resume document. Highlighting these skills in interviews is recommended.
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {currentAnalysis.extractedSkills?.map((skill, i) => (
                                                    <span key={i} className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-100 font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1">
                                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                                        {skill}
                                                    </span>
                                                )) || <span className="text-xs text-slate-400">No skills parsed</span>}
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-3">
                                                <AlertTriangle className="w-4.5 h-4.5 text-rose-500" />
                                                Missing Core Skills
                                            </h3>
                                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                                Our Gemini models identified these gaps by comparing your resume with the requested job role. For a better ATS match and developer credibility, add corresponding projects or sections.
                                            </p>
                                            
                                            {currentAnalysis.missingSkills?.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {currentAnalysis.missingSkills.map((skill, i) => (
                                                        <span key={i} className="text-xs bg-rose-50 text-rose-800 border border-rose-100 font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1">
                                                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 p-3 rounded-2xl text-xs font-semibold">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Excellent match! Your resume contains all core skills needed.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Experience Tab */}
                                {activeTab === "experience" && (
                                    <div className="space-y-4">
                                        {currentAnalysis.extractedExperience && currentAnalysis.extractedExperience.length > 0 ? (
                                            currentAnalysis.extractedExperience.map((exp, i) => (
                                                <div key={i} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm transition hover:shadow-md">
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                                                        <div>
                                                            <h3 className="text-sm font-bold text-slate-800">{exp.role}</h3>
                                                            <p className="text-xs font-bold text-indigo-600 mt-0.5">{exp.company}</p>
                                                        </div>
                                                        <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {exp.duration}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 leading-relaxed mt-2 whitespace-pre-line">
                                                        {exp.description}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-3xl border border-slate-100">
                                                <Briefcase className="w-8 h-8 mx-auto text-slate-200 mb-2" />
                                                <p className="text-xs font-medium">No professional experience parsed.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Projects Tab */}
                                {activeTab === "projects" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {currentAnalysis.extractedProjects && currentAnalysis.extractedProjects.length > 0 ? (
                                            currentAnalysis.extractedProjects.map((proj, i) => (
                                                <div key={i} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                                                    <div>
                                                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                                            <Code className="w-4 h-4 text-indigo-600" />
                                                            {proj.title}
                                                        </h3>
                                                        <p className="text-xs text-slate-500 leading-relaxed mt-2 whitespace-pre-line">
                                                            {proj.description}
                                                        </p>
                                                    </div>

                                                    {proj.technologies && proj.technologies.length > 0 && (
                                                        <div className="mt-4 pt-3 border-t border-slate-100">
                                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                                                                Technologies Used
                                                            </p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {proj.technologies.map((t, idx) => (
                                                                    <span key={idx} className="text-[10px] bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 rounded-lg">
                                                                        {t}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="md:col-span-2 text-center py-12 text-slate-400 bg-slate-50 rounded-3xl border border-slate-100">
                                                <Code className="w-8 h-8 mx-auto text-slate-200 mb-2" />
                                                <p className="text-xs font-medium">No projects parsed from resume.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
