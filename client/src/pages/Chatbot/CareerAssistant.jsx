import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/Navbar";
import {
    sendChatMessage,
    getChatHistory,
    clearChatHistory,
} from "../../services/chatbotService";

function CareerAssistant() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const quickChips = [
        "Explain Dynamic Programming concepts",
        "Give me a study plan for Amazon SDE",
        "What are common behavioral interview tips?",
        "How do I optimize my resume for ATS?",
        "Explain differences between SQL and NoSQL"
    ];

    useEffect(() => {
        fetchChatHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchChatHistory = async () => {
        try {
            const res = await getChatHistory();
            if (res.data.success) {
                setMessages(res.data.chatHistory || []);
            }
        } catch (error) {
            console.error("Fetch chat error:", error);
        }
    };

    const handleSendMessage = async (textToSend) => {
        const text = textToSend || inputText;
        if (!text || text.trim() === "") return;

        if (!textToSend) {
            setInputText("");
        }

        // Optimistically append user message
        const userMsg = { sender: "user", text, createdAt: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const res = await sendChatMessage(text);

            if (res.data.success) {
                // Replace message state with server sync to ensure DB indices align
                setMessages(res.data.chatHistory);
            }
        } catch (error) {
            console.error("Chat message send error:", error);
            // Append error message from system
            setMessages(prev => [
                ...prev,
                { sender: "ai", text: "⚠️ System offline. I couldn't transmit that query to my brain. Please try again later.", createdAt: new Date() }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = async () => {
        if (!window.confirm("Are you sure you want to clear your chat history?")) return;
        try {
            const res = await clearChatHistory();
            if (res.data.success) {
                setMessages([]);
            }
        } catch (error) {
            console.error("Clear chat error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            
            <div className="max-w-5xl w-full mx-auto flex-1 py-8 px-6 flex flex-col md:flex-row gap-6 min-h-[calc(100vh-4rem)]">
                
                {/* Chat Instructions Sidebar */}
                <div className="w-full md:w-80 shrink-0 flex flex-col gap-4">
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold">
                                🤖
                            </div>
                            <div>
                                <h2 className="font-extrabold text-gray-800">Career Assistant</h2>
                                <p className="text-xs text-green-500 font-semibold flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online (Gemini AI)
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Welcome! I'm Prep Ninja, your interview coach. Ask me technical problems, system design advice, resume guidelines, or behavioural situations.
                        </p>
                        
                        <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center text-xs">
                            <span className="text-gray-400">XP reward per conversation:</span>
                            <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">+5 XP</span>
                        </div>
                    </div>

                    <div className="bg-indigo-600 text-white rounded-3xl p-6 shadow-md shadow-indigo-100">
                        <h3 className="font-bold text-lg mb-2">Need Inspiration?</h3>
                        <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                            Click on any of the floating prompts to quickly ask concepts or roadmap recommendations.
                        </p>
                        <button
                            onClick={handleClearChat}
                            className="w-full bg-indigo-700/50 hover:bg-red-600 hover:text-white text-indigo-100 text-xs font-bold py-2.5 rounded-xl border border-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
                        >
                            <i className="bi bi-trash3"></i> Clear Conversation
                        </button>
                    </div>
                </div>

                {/* Main Conversational Panel */}
                <div className="flex-1 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col overflow-hidden max-h-[600px] md:max-h-[calc(100vh-8rem)]">
                    
                    {/* Chat Area Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                <span className="text-5xl animate-bounce mb-3">👋</span>
                                <h3 className="text-xl font-bold text-gray-700">Hey there! I am Prep Ninja</h3>
                                <p className="text-gray-400 text-sm max-w-sm mt-1 mb-6">
                                    Your personal placement counselor. What would you like to prepare or learn about today?
                                </p>
                                
                                <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                                    {quickChips.map((chip, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSendMessage(chip)}
                                            className="text-xs bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 text-gray-600 hover:text-indigo-600 py-2 px-3.5 rounded-full text-left transition duration-200 active:scale-[0.98]"
                                        >
                                            {chip} &rarr;
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[75%] rounded-2xl px-4.5 py-3 text-sm leading-relaxed shadow-sm ${
                                            msg.sender === "user"
                                                ? "bg-indigo-600 text-white rounded-br-none"
                                                : "bg-slate-100 text-gray-800 rounded-bl-none border border-slate-200/50"
                                        }`}
                                        style={{ whiteSpace: "pre-line" }}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))
                        )}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 border border-slate-200/50 rounded-2xl rounded-bl-none px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                                    <span className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </span>
                                    <span>AI is writing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input form */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ask me anything..."
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-sm"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSendMessage();
                                }
                            }}
                            disabled={loading}
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={loading || !inputText.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white w-12 rounded-xl flex items-center justify-center transition active:scale-[0.96]"
                        >
                            <i className="bi bi-send-fill text-lg"></i>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default CareerAssistant;
