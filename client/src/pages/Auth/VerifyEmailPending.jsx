import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Loader2 } from "lucide-react";
import logo from "../../assets/prep-ninja-logo.png";

function VerifyEmailPending() {
    const location = useLocation();
    const email = location.state?.email || "";
    const { resendVerification } = useAuth();

    const [resendStatus, setResendStatus] = useState("");
    const [resending, setResending] = useState(false);

    const handleResend = async () => {
        if (!email) {
            setResendStatus("Email address not found. Please sign up again.");
            return;
        }

        setResending(true);
        setResendStatus("");

        const result = await resendVerification(email);
        setResending(false);
        setResendStatus(
            result.success
                ? "Verification email sent! Check your inbox."
                : result.error
        );
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-5">
            <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8 text-center flex flex-col items-center">
                <img src={logo} alt="Prep Ninja" className="h-12 w-auto object-contain mb-6" />
                <Mail className="text-indigo-600 mb-4" size={48} />

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Check your email
                </h2>

                <p className="text-gray-600 mb-2">
                    We sent a verification link to
                </p>
                {email && (
                    <p className="font-semibold text-gray-800 mb-4">{email}</p>
                )}
                <p className="text-gray-500 text-sm mb-6">
                    Click the link in the email to verify your account. You can
                    log in anytime — verification is not required to sign in.
                </p>

                <button
                    onClick={handleResend}
                    disabled={resending || !email}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {resending && <Loader2 size={18} className="animate-spin" />}
                    Resend verification email
                </button>

                {resendStatus && (
                    <p
                        className={`mt-4 text-sm ${
                            resendStatus.includes("sent")
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        {resendStatus}
                    </p>
                )}

                <p className="mt-6 text-gray-600">
                    Want to sign in now?{" "}
                    <Link to="/login" className="text-indigo-600 font-semibold">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default VerifyEmailPending;
