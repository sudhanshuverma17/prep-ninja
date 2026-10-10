import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import { updateProfile } from "../../services/userService";

function Profile() {
    const { user, updateUser } = useAuth();
    
    const [name, setName] = useState(user?.name || "");
    const [careerGoal, setCareerGoal] = useState(user?.careerGoal || "");
    const [targetCompany, setTargetCompany] = useState(user?.targetCompany || "");
    const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || "Student");
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
    
    const [skills, setSkills] = useState(user?.skills || []);
    const [newSkill, setNewSkill] = useState("");
    const [statusMsg, setStatusMsg] = useState("");
    const [isError, setIsError] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setCareerGoal(user.careerGoal || "");
            setTargetCompany(user.targetCompany || "");
            setExperienceLevel(user.experienceLevel || "Student");
            setTwoFactorEnabled(user.twoFactorEnabled || false);
            setSkills(user.skills || []);
        }
    }, [user]);

    const handleAddSkill = (e) => {
        e.preventDefault();
        const skillClean = newSkill.trim();
        if (skillClean && !skills.includes(skillClean)) {
            setSkills([...skills, skillClean]);
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatusMsg("");
        setIsError(false);

        try {
            const res = await updateProfile({
                name,
                careerGoal,
                targetCompany,
                experienceLevel,
                twoFactorEnabled,
                skills,
            });

            if (res.data.success) {
                updateUser(res.data.user);
                setStatusMsg("Profile updated successfully!");
                setIsError(false);
            } else {
                setStatusMsg(res.data.message || "Failed to update profile");
                setIsError(true);
            }
        } catch (error) {
            console.error("Save profile error:", error);
            setStatusMsg(error.response?.data?.message || "Failed to connect to the server");
            setIsError(true);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-4xl mx-auto py-10 px-6">
                
                {/* Header Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Customize Profile
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Tailor your career goals and preparation parameters for personalized AI recommendations.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    
                    {/* Sidebar Profile Card */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
                            <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-md shadow-indigo-100 mb-4">
                                {name ? name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">{name}</h2>
                            <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
                            
                            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-left">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Level:</span>
                                    <span className="font-semibold text-indigo-600">Lvl {user?.level || 1}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">XP Points:</span>
                                    <span className="font-semibold text-gray-700">{user?.xp || 0} XP</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Active Streak:</span>
                                    <span className="font-semibold text-orange-500">🔥 {user?.streak || 0} Days</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Fields */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                            <form onSubmit={handleSave} className="space-y-6">
                                
                                {/* Status Message */}
                                {statusMsg && (
                                    <div className={`p-4 rounded-xl text-sm font-medium ${isError ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                                        {statusMsg}
                                    </div>
                                )}

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                        required
                                    />
                                </div>

                                {/* Goals & Company */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Career Goal / Role</label>
                                        <input
                                            type="text"
                                            value={careerGoal}
                                            onChange={(e) => setCareerGoal(e.target.value)}
                                            placeholder="e.g. Frontend Developer"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Target Company</label>
                                        <input
                                            type="text"
                                            value={targetCompany}
                                            onChange={(e) => setTargetCompany(e.target.value)}
                                            placeholder="e.g. Google, Amazon"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Experience Level */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level</label>
                                    <select
                                        value={experienceLevel}
                                        onChange={(e) => setExperienceLevel(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-colors"
                                    >
                                        <option value="Student">Student (Placement Ready)</option>
                                        <option value="Entry Level">Entry Level (0-2 Years)</option>
                                        <option value="Intermediate">Mid Level (2-5 Years)</option>
                                        <option value="Senior">Senior Level (5+ Years)</option>
                                    </select>
                                </div>

                                {/* Skills tag input */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Skills</label>
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            placeholder="Type a skill and click Add"
                                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleAddSkill(e);
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddSkill}
                                            className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-5 rounded-xl transition"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {/* Skills list tags */}
                                    <div className="flex flex-wrap gap-2">
                                        {skills.length === 0 ? (
                                            <p className="text-gray-400 text-sm italic py-1">No skills added yet. Add skills to get better mock interviews.</p>
                                        ) : (
                                            skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold"
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSkill(skill)}
                                                        className="text-slate-400 hover:text-red-500 font-bold ml-1 focus:outline-none"
                                                    >
                                                        &times;
                                                    </button>
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Security / 2FA Settings */}
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-800">Two-Factor Authentication (2FA)</h3>
                                        <p className="text-xs text-gray-400 mt-0.5">Require verification code at logins for enhanced security.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${twoFactorEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                    >
                                        <div
                                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'}`}
                                        />
                                    </button>
                                </div>

                                {/* Save Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-2xl transition disabled:opacity-50"
                                    >
                                        {saving ? "Saving Changes..." : "Save Profile"}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Profile;
