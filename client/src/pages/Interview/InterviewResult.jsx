import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInterviewById } from "../../services/interviewService";
import Navbar from "../../components/Navbar";

function InterviewResult() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchInterviewResult();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchInterviewResult = async () => {
        try {
            const res = await getInterviewById(id);

            setInterview(res.data.interview);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to fetch interview result"
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100">
                <Navbar />
                <div className="max-w-5xl mx-auto p-6 flex justify-center items-center h-[calc(100vh-8rem)]">
                    <h2 className="text-2xl font-semibold">
                        Loading Result...
                    </h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-100">
                <Navbar />
                <div className="max-w-5xl mx-auto p-6 flex justify-center items-center h-[calc(100vh-8rem)]">
                    <div className="bg-red-100 text-red-700 p-4 rounded-xl">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    const score = interview?.finalScore || 0;

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />
            <div className="max-w-5xl mx-auto p-6">

                {/* Header */}
                <div className="bg-white rounded-3xl shadow-lg p-8 text-center mb-8">
                    <div className="w-24 h-24 mx-auto rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                        <span className="text-4xl">🏆</span>
                    </div>

                    <h1 className="text-4xl font-bold text-indigo-600">
                        Interview Completed
                    </h1>

                    <p className="text-gray-500 mt-2">
                        AI Mock Interview Result
                    </p>

                    <div className="mt-6">
                        <h2 className="text-gray-500">
                            Final Score
                        </h2>

                        <div className="text-6xl font-bold text-indigo-600">
                            {score}/10
                        </div>
                    </div>
                </div>

                {/* Interview Details */}
                <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-5">
                        Interview Details
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <span className="font-semibold">
                                Role:
                            </span>{" "}
                            {interview.role}
                        </div>

                        <div>
                            <span className="font-semibold">
                                Domain:
                            </span>{" "}
                            {interview.domain}
                        </div>

                        <div>
                            <span className="font-semibold">
                                Difficulty:
                            </span>{" "}
                            {interview.difficulty}
                        </div>

                        <div>
                            <span className="font-semibold">
                                Status:
                            </span>{" "}
                            <span className="text-green-600 font-medium">
                                {interview.status}
                            </span>
                        </div>

                        <div>
                            <span className="font-semibold">
                                Questions:
                            </span>{" "}
                            {interview.questions?.length || 0}
                        </div>

                        <div>
                            <span className="font-semibold">
                                Answers Submitted:
                            </span>{" "}
                            {interview.answers?.length || 0}
                        </div>
                    </div>
                </div>

                {/* Answer Feedback */}
                <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-5">
                        Answer Evaluation
                    </h2>

                    {interview.answers?.length === 0 ? (
                        <p className="text-gray-500">
                            No answers submitted.
                        </p>
                    ) : (
                        <div className="space-y-5">
                            {interview.answers.map(
                                (item, index) => (
                                    // <div
                                    //     key={index}
                                    //     className="border rounded-2xl p-5"
                                    // >
                                    //     <h3 className="font-semibold text-lg mb-2">
                                    //         Question {index + 1}
                                    //     </h3>

                                    //     <p className="text-gray-700 mb-3">
                                    //         {item.question}
                                    //     </p>

                                    //     <div className="bg-slate-50 p-3 rounded-xl mb-3">
                                    //         <span className="font-medium">
                                    //             Answer:
                                    //         </span>
                                    //         <p className="mt-1 text-gray-600">
                                    //             {item.answer}
                                    //         </p>
                                    //     </div>

                                    //     <div className="flex flex-wrap gap-4">
                                    //         <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl">
                                    //             Score:
                                    //             {" "}
                                    //             {item.score}/10
                                    //         </div>

                                    //         <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl">
                                    //             Feedback:
                                    //             {" "}
                                    //             {item.feedback}
                                    //         </div>
                                    //     </div>
                                    // </div>
                                    <div
                                        key={index}
                                        className="border rounded-2xl p-5 shadow-sm"
                                    >
                                        <h3 className="font-bold text-lg mb-3 text-indigo-600">
                                            Question {index + 1}
                                        </h3>

                                        <p className="mb-4 text-gray-800">
                                            {item.question}
                                        </p>

                                        {/* User Answer */}
                                        <div className="bg-slate-100 p-4 rounded-xl mb-4">
                                            <h4 className="font-semibold mb-2 text-slate-700">
                                                Your Answer
                                            </h4>

                                            <p className="text-gray-700">
                                                {item.answer}
                                            </p>
                                        </div>

                                        {/* Correct Answer */}
                                        <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-4">
                                            <h4 className="font-semibold text-green-700 mb-2">
                                                Correct Answer
                                            </h4>

                                            <p className="text-gray-700">
                                                {item.correctAnswer ||
                                                    "Correct answer not available"}
                                            </p>
                                        </div>

                                        {/* Evaluation */}
                                        <div className="grid md:grid-cols-3 gap-4">

                                            <div className="bg-indigo-100 p-4 rounded-xl">
                                                <h4 className="font-semibold text-indigo-700">
                                                    Score
                                                </h4>

                                                <p className="text-2xl font-bold mt-2">
                                                    {item.score}/10
                                                </p>
                                            </div>

                                            <div className="bg-yellow-100 p-4 rounded-xl">
                                                <h4 className="font-semibold text-yellow-700">
                                                    Feedback
                                                </h4>

                                                <p className="mt-2 text-gray-700">
                                                    {item.feedback ||
                                                        "No feedback available"}
                                                </p>
                                            </div>

                                            <div className="bg-blue-100 p-4 rounded-xl">
                                                <h4 className="font-semibold text-blue-700">
                                                    Improvement
                                                </h4>

                                                <p className="mt-2 text-gray-700">
                                                    {item.improvement ||
                                                        "No suggestions available"}
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4 justify-center">
                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700"
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() =>
                            navigate("/history")
                        }
                        className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50"
                    >
                        Interview History
                    </button>

                    <button
                        onClick={() =>
                            navigate("/create-interview")
                        }
                        className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
                    >
                        New Interview
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InterviewResult;