import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/prep-ninja-logo.png";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const result = await forgotPassword(email);
        if (result.success) {
            setMessage("Password reset email sent successfully");
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-5">
            <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8">
                <div className="text-center mb-6 flex flex-col items-center">
                    <img src={logo} alt="Prep Ninja" className="h-16 w-auto object-contain mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
                </div>
                {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                        Send Reset Link
                    </button>
                </form>

                <p className="mt-4 text-center text-sm">
                    Remembered your password?{" "}
                    <Link to="/login" className="text-indigo-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default ForgotPassword;