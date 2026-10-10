// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Navbar from "../../components/Navbar";

// function CreateInterview() {
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         role: "",
//         domain: "",
//         difficulty: "Beginner",
//     });

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             setLoading(true);
//             setError("");

//             const token = localStorage.getItem("token");

//             const res = await axios.post(
//                 "http://localhost:5000/api/interviews/create",
//                 formData,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             const interviewId = res.data.interview._id;

//             navigate(`/interview/${interviewId}`);
//         } catch (err) {
//             console.error(err);

//             setError(
//                 err.response?.data?.message ||
//                     "Failed to create interview"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-slate-100 flex justify-center items-center p-5">
//             <div className="bg-white shadow-xl rounded-3xl w-full max-w-2xl p-8">
//                 <div className="text-center mb-8">
//                     <div className="flex justify-center mb-4">
//                         <div className="bg-indigo-100 p-4 rounded-full">
//                             <i className="bi bi-mic-fill text-indigo-600 text-3xl"></i>
//                         </div>
//                     </div>

//                     <h1 className="text-4xl font-bold text-indigo-600">
//                         AI Mock Interview
//                     </h1>

//                     <p className="text-gray-500 mt-2">
//                         Generate AI-powered interview questions and
//                         evaluate your answers.
//                     </p>
//                 </div>

//                 {error && (
//                     <div className="alert alert-danger mb-4">
//                         {error}
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit}>
//                     {/* Role */}
//                     <div className="mb-5">
//                         <label className="block text-gray-700 font-semibold mb-2">
//                             Job Role
//                         </label>

//                         <input
//                             type="text"
//                             name="role"
//                             value={formData.role}
//                             onChange={handleChange}
//                             placeholder="Frontend Developer"
//                             required
//                             className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
//                         />
//                     </div>

//                     {/* Domain */}
//                     <div className="mb-5">
//                         <label className="block text-gray-700 font-semibold mb-2">
//                             Domain / Technology
//                         </label>

//                         <select
//                             name="domain"
//                             value={formData.domain}
//                             onChange={handleChange}
//                             required
//                             className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
//                         >
//                             <option value="">
//                                 Select Technology
//                             </option>

//                             <option value="React">
//                                 React
//                             </option>

//                             <option value="Node.js">
//                                 Node.js
//                             </option>

//                             <option value="JavaScript">
//                                 JavaScript
//                             </option>

//                             <option value="MongoDB">
//                                 MongoDB
//                             </option>

//                             <option value="Java">
//                                 Java
//                             </option>

//                             <option value="Python">
//                                 Python
//                             </option>

//                             <option value="Full Stack">
//                                 Full Stack
//                             </option>
//                         </select>
//                     </div>

//                     {/* Difficulty */}
//                     <div className="mb-6">
//                         <label className="block text-gray-700 font-semibold mb-2">
//                             Difficulty Level
//                         </label>

//                         <div className="grid grid-cols-3 gap-3">
//                             {[
//                                 "Beginner",
//                                 "Intermediate",
//                                 "Advanced",
//                             ].map((level) => (
//                                 <button
//                                     key={level}
//                                     type="button"
//                                     onClick={() =>
//                                         setFormData({
//                                             ...formData,
//                                             difficulty: level,
//                                         })
//                                     }
//                                     className={`py-3 rounded-xl font-medium transition ${
//                                         formData.difficulty === level
//                                             ? "bg-indigo-600 text-white"
//                                             : "bg-gray-100 text-gray-700"
//                                     }`}
//                                 >
//                                     {level}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Features */}
//                     <div className="bg-slate-50 rounded-2xl p-5 mb-6">
//                         <h4 className="font-semibold text-gray-800 mb-3">
//                             What You'll Get
//                         </h4>

//                         <div className="grid md:grid-cols-2 gap-3 text-sm">
//                             <div>
//                                 ✅ AI Generated Questions
//                             </div>

//                             <div>
//                                 ✅ Real Interview Experience
//                             </div>

//                             <div>
//                                 ✅ Instant Feedback
//                             </div>

//                             <div>
//                                 ✅ Performance Score
//                             </div>
//                         </div>
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition flex justify-center items-center gap-2"
//                     >
//                         {loading ? (
//                             <>
//                                 <div className="spinner-border spinner-border-sm"></div>
//                                 Creating...
//                             </>
//                         ) : (
//                             <>
//                                 <i className="bi bi-play-circle-fill"></i>
//                                 Start Interview
//                             </>
//                         )}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default CreateInterview;




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createInterview } from "../../services/interviewService";
import Navbar from "../../components/Navbar";

function CreateInterview() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        role: "",
        domain: "",
        difficulty: "Beginner",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const res = await createInterview(formData);

            navigate(`/interview/${res.data.interview._id}`);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to create interview"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-slate-100 py-10 px-4">
                <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">

                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="bi bi-mic-fill text-4xl text-indigo-600"></i>
                        </div>

                        <h1 className="text-4xl font-bold text-indigo-600">
                            AI Mock Interview
                        </h1>

                        <p className="text-gray-500 mt-3">
                            Select your role and start practicing interviews
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* Job Role */}
                        <div className="mb-5">
                            <label className="block font-semibold mb-2">
                                Job Role
                            </label>

                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-xl p-3"
                            >
                                <option value="">
                                    Select Job Role
                                </option>

                                <option value="Frontend Developer">
                                    Frontend Developer
                                </option>

                                <option value="Backend Developer">
                                    Backend Developer
                                </option>

                                <option value="Full Stack Developer">
                                    Full Stack Developer
                                </option>

                                <option value="MERN Stack Developer">
                                    MERN Stack Developer
                                </option>

                                <option value="Java Full Stack Developer">
                                    Java Full Stack Developer
                                </option>

                                <option value="Python Django Developer">
                                    Python Django Developer
                                </option>

                                <option value="React Developer">
                                    React Developer
                                </option>

                                <option value="Node.js Developer">
                                    Node.js Developer
                                </option>

                                <option value="Java Developer">
                                    Java Developer
                                </option>

                                <option value="Python Developer">
                                    Python Developer
                                </option>

                                <option value="Software Engineer">
                                    Software Engineer
                                </option>

                                <option value="DevOps Engineer">
                                    DevOps Engineer
                                </option>

                                <option value="Cloud Engineer">
                                    Cloud Engineer
                                </option>

                                <option value="Data Analyst">
                                    Data Analyst
                                </option>

                                <option value="Data Scientist">
                                    Data Scientist
                                </option>

                                <option value="AI Engineer">
                                    AI Engineer
                                </option>

                                <option value="Machine Learning Engineer">
                                    Machine Learning Engineer
                                </option>

                                <option value="QA Engineer">
                                    QA Engineer
                                </option>

                                <option value="Automation Tester">
                                    Automation Tester
                                </option>

                                <option value="Cyber Security Analyst">
                                    Cyber Security Analyst
                                </option>
                            </select>
                        </div>

                        {/* Technology */}
                        <div className="mb-5">
                            <label className="block font-semibold mb-2">
                                Technology / Domain
                            </label>

                            <select
                                name="domain"
                                value={formData.domain}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-xl p-3"
                            >
                                <option value="">
                                    Select Technology
                                </option>

                                <option value="HTML">
                                    HTML
                                </option>

                                <option value="CSS">
                                    CSS
                                </option>

                                <option value="JavaScript">
                                    JavaScript
                                </option>

                                <option value="React">
                                    React
                                </option>

                                <option value="Angular">
                                    Angular
                                </option>

                                <option value="Vue">
                                    Vue
                                </option>

                                <option value="Node.js">
                                    Node.js
                                </option>

                                <option value="Express.js">
                                    Express.js
                                </option>

                                <option value="MongoDB">
                                    MongoDB
                                </option>

                                <option value="MySQL">
                                    MySQL
                                </option>

                                <option value="PostgreSQL">
                                    PostgreSQL
                                </option>

                                <option value="Java">
                                    Java
                                </option>

                                <option value="Spring Boot">
                                    Spring Boot
                                </option>

                                <option value="Python">
                                    Python
                                </option>

                                <option value="Django">
                                    Django
                                </option>

                                <option value="Flask">
                                    Flask
                                </option>

                                <option value="Machine Learning">
                                    Machine Learning
                                </option>

                                <option value="Artificial Intelligence">
                                    Artificial Intelligence
                                </option>

                                <option value="Data Science">
                                    Data Science
                                </option>

                                <option value="AWS">
                                    AWS
                                </option>

                                <option value="Azure">
                                    Azure
                                </option>

                                <option value="Docker">
                                    Docker
                                </option>

                                <option value="Kubernetes">
                                    Kubernetes
                                </option>

                                <option value="Full Stack">
                                    Full Stack
                                </option>

                                <option value="MERN Stack">
                                    MERN Stack
                                </option>
                            </select>
                        </div>

                        {/* Difficulty */}
                        <div className="mb-6">
                            <label className="block font-semibold mb-2">
                                Difficulty
                            </label>

                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    "Beginner",
                                    "Intermediate",
                                    "Advanced",
                                ].map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                difficulty: level,
                                            })
                                        }
                                        className={`py-3 rounded-xl font-semibold ${formData.difficulty === level
                                                ? "bg-indigo-600 text-white"
                                                : "bg-gray-100"
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="bg-slate-50 rounded-2xl p-5 mb-6">
                            <h3 className="font-semibold mb-3">
                                Interview Features
                            </h3>

                            <div className="grid md:grid-cols-2 gap-3">
                                <div>✅ AI Generated Questions</div>
                                <div>✅ Real-time Evaluation</div>
                                <div>✅ Detailed Feedback</div>
                                <div>✅ Performance Score</div>
                                <div>✅ Interview History</div>
                                <div>✅ Progress Tracking</div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
                        >
                            {loading
                                ? "Creating Interview..."
                                : "Start Interview"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CreateInterview;