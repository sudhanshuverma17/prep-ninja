import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInterviews } from "../../services/interviewService";
import Navbar from "../../components/Navbar";

function InterviewHistory() {
    const navigate = useNavigate();

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const res = await getInterviews();

            setInterviews(res.data.interviews || []);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Failed to load interviews"
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="text-xl font-semibold">
                    Loading Interviews...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-indigo-600">
                            Interview History
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Track all your AI Mock Interviews
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            navigate("/create-interview")
                        }
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold"
                    >
                        + New Interview
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {interviews.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
                        <h2 className="text-2xl font-bold text-gray-700">
                            No Interviews Found
                        </h2>

                        <p className="text-gray-500 mt-3">
                            Create your first AI Mock Interview.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/create-interview")
                            }
                            className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl"
                        >
                            Start Interview
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {interviews.map((interview) => (
                            <div
                                key={interview._id}
                                className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                                        {interview.domain}
                                    </span>

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            interview.status ===
                                            "completed"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {interview.status}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-800">
                                    {interview.role}
                                </h3>

                                <p className="text-gray-500 mt-2">
                                    Difficulty:
                                    {" "}
                                    {interview.difficulty}
                                </p>

                                <p className="text-gray-500">
                                    Questions:
                                    {" "}
                                    {interview.questions?.length || 0}
                                </p>

                                <div className="mt-4">
                                    <div className="text-sm text-gray-500">
                                        Final Score
                                    </div>

                                    <div className="text-3xl font-bold text-indigo-600">
                                        {interview.finalScore || 0}/10
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/interview/${interview._id}`
                                            )
                                        }
                                        className="flex-1 bg-indigo-600 text-white py-2 rounded-xl"
                                    >
                                        {interview.status ===
                                        "completed"
                                            ? "View"
                                            : "Continue"}
                                    </button>

                                    {interview.status ===
                                        "completed" && (
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/result/${interview._id}`
                                                )
                                            }
                                            className="flex-1 border border-indigo-600 text-indigo-600 py-2 rounded-xl"
                                        >
                                            Result
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default InterviewHistory;