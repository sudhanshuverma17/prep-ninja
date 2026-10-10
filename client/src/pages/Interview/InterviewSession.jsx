import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getInterviewById,
    submitAnswer,
    completeInterview,
} from "../../services/interviewService";
import Navbar from "../../components/Navbar";

function InterviewSession() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [interview, setInterview] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchInterview();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchInterview = async () => {
        try {
            const res = await getInterviewById(id);

            setInterview(res.data.interview);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Failed to load interview"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!answer.trim()) {
            return alert("Please enter your answer");
        }

        try {
            setSubmitting(true);

            await submitAnswer(id, {
                question: interview.questions[currentQuestion],
                answer,
            });

            setAnswer("");

            if (
                currentQuestion <
                interview.questions.length - 1
            ) {
                setCurrentQuestion(
                    (prev) => prev + 1
                );
            } else {
                await completeInterview(id);

                navigate(`/result/${id}`);
            }
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                "Failed to submit answer"
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100">
                <Navbar />
                <div className="max-w-4xl mx-auto p-6 flex items-center justify-center h-[calc(100vh-8rem)]">
                    <h2 className="text-2xl font-bold">
                        Loading Interview...
                    </h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-100">
                <Navbar />
                <div className="max-w-4xl mx-auto p-6 flex items-center justify-center h-[calc(100vh-8rem)]">
                    <div className="bg-red-100 text-red-700 p-4 rounded-xl">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    const progress =
        ((currentQuestion + 1) /
            interview.questions.length) *
        100;

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />
            <div className="max-w-4xl mx-auto p-6">

                {/* Header */}
                <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold text-indigo-600">
                        AI Mock Interview
                    </h1>

                    <p className="text-gray-500 mt-2">
                        {interview.role} • {interview.domain}
                    </p>

                    {/* Progress */}
                    <div className="mt-5">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">
                                Question {currentQuestion + 1}
                            </span>

                            <span className="text-sm font-medium">
                                {interview.questions.length}
                            </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-indigo-600 h-3 rounded-full transition-all"
                                style={{
                                    width: `${progress}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Question */}
                <div className="bg-white rounded-3xl shadow-lg p-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-6">
                        Question {currentQuestion + 1}
                    </h2>

                    <div className="bg-indigo-50 p-6 rounded-2xl mb-6">
                        <p className="text-lg text-gray-800">
                            {
                                interview.questions[
                                    currentQuestion
                                ]
                            }
                        </p>
                    </div>

                    {/* Answer */}
                    <div className="mb-6">
                        <label className="block font-medium text-gray-700 mb-3">
                            Your Answer
                        </label>

                        <textarea
                            rows="8"
                            value={answer}
                            onChange={(e) =>
                                setAnswer(
                                    e.target.value
                                )
                            }
                            placeholder="Write your answer here..."
                            className="w-full border border-gray-300 rounded-2xl p-4 focus:outline-none focus:border-indigo-500 resize-none"
                        />
                    </div>

                    <button
                        onClick={handleSubmitAnswer}
                        disabled={submitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold transition"
                    >
                        {submitting
                            ? "Submitting..."
                            : currentQuestion ===
                              interview.questions.length - 1
                            ? "Finish Interview"
                            : "Next Question"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InterviewSession;