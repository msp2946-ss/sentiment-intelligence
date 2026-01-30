import React, { useState } from 'react';
import axios from 'axios';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const SentimentInput = ({ onResult }) => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAnalyze = async () => {
        if (!text.trim()) return;

        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/predict', { text });
            onResult(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to analyze sentiment. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">

            <h3 className="text-lg font-semibold mb-6 flex items-center gap-3 text-gray-800">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Input Analysis
            </h3>

            <div className="relative">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to analyze sentiment..."
                    className="w-full bg-white/50 border border-gray-200 rounded-2xl p-6 text-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none h-56 placeholder:text-gray-400 text-lg leading-relaxed shadow-inner"
                />
                <div className="absolute bottom-4 right-4 text-xs font-mono text-gray-400 bg-white/80 px-2 py-1 rounded-md">
                    {text.length} chars
                </div>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-3">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleAnalyze}
                    disabled={loading || !text.trim()}
                    className={twMerge(
                        "flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all transform active:scale-95 duration-200",
                        loading || !text.trim()
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/20"
                    )}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Analyze Text
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default SentimentInput;
