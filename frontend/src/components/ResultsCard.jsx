import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Meh, BarChart2 } from 'lucide-react';
import { clsx } from 'clsx';

const ResultsCard = ({ result }) => {
    if (!result) {
        return (
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 p-10 h-full flex flex-col items-center justify-center text-center opacity-80 border-dashed transition-all hover:opacity-100 hover:border-blue-200/50 hover:shadow-xl group">
                <div className="bg-white p-8 rounded-full mb-8 group-hover:scale-111 transition-transform duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100">
                    <BarChart2 size={40} className="text-blue-500/80 group-hover:text-blue-600 transition-colors" />
                </div>
                <p className="text-gray-800 text-2xl font-bold tracking-tight">Ready to Analyze</p>
                <p className="text-gray-500 text-base max-w-xs mt-3 leading-relaxed font-medium">Enter your text to experience the gravity-defying power of AI.</p>
            </div>
        );
    }

    const { sentiment, confidence } = result;

    const config = {
        pos: {
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            label: 'Positive',
            icon: Smile,
            gradient: 'from-emerald-400 to-teal-400'
        },
        neg: {
            color: 'text-rose-500',
            bg: 'bg-rose-500/10',
            label: 'Negative',
            icon: Frown,
            gradient: 'from-rose-400 to-pink-500'
        },
        default: {
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            label: 'Neutral',
            icon: Meh,
            gradient: 'from-amber-400 to-orange-400'
        },
    };

    const currentConfig = config[sentiment] || config.default;
    const Icon = currentConfig.icon;
    const percentage = Math.round(confidence * 100);

    return (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
            {/* Ambient Glow */}
            <div className={clsx("absolute top-0 right-0 w-80 h-80 bg-gradient-to-br opacity-10 blur-[90px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3", currentConfig.gradient)}></div>

            <h3 className="text-lg font-semibold mb-8 flex items-center gap-3 text-gray-800 relative z-10">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
                Intelligence Result
            </h3>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={sentiment + confidence}
                className="flex-1 flex flex-col items-center justify-center py-4 relative z-10"
            >
                <div className="relative mb-10 group">
                    <div className={clsx("absolute inset-0 blur-2xl opacity-20 transform scale-150 transition-all duration-500 group-hover:scale-175 group-hover:opacity-30", currentConfig.bg)}></div>
                    <motion.div
                        initial={{ rotate: -10, scale: 0.5 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className={clsx("relative z-10 text-8xl drop-shadow-lg filter transition-transform duration-300 group-hover:-translate-y-2", currentConfig.color)}
                    >
                        <Icon size={100} strokeWidth={1.5} />
                    </motion.div>
                </div>

                <h2 className="text-6xl font-extrabold text-gray-900 mb-1 tracking-tight">{currentConfig.label}</h2>
                <div className="flex flex-col items-center mb-1">
                    <span className={clsx("text-3xl font-bold tracking-tighter", currentConfig.color)}>{percentage}%</span>
                    <span className="text-gray-400 text-xs uppercase tracking-[0.2em] font-bold mt-1">Confidence</span>
                </div>

                <div className="w-full max-w-sm mt-12 space-y-4">
                    <div className="flex justify-between text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        <span>Confidence</span>
                        <span className="text-gray-900">{percentage}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-white">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className={clsx("h-full rounded-full shadow-md bg-gradient-to-r", currentConfig.gradient)}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ResultsCard;
