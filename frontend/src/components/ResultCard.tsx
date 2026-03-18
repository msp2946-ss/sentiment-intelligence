import { motion } from 'motion/react';
import { SmilePlus, Frown, Meh, TrendingUp } from 'lucide-react';
import type { SentimentResult } from '../utils/sentimentAnalysis';

interface ResultCardProps {
  result: SentimentResult;
}

const sentimentConfig = {
  positive: {
    icon: SmilePlus,
    label: 'Positive',
    gradient: 'from-green-500 to-emerald-500',
    glow: 'shadow-green-500/50',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    emoji: '😊'
  },
  negative: {
    icon: Frown,
    label: 'Negative',
    gradient: 'from-red-500 to-rose-500',
    glow: 'shadow-red-500/50',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    emoji: '😞'
  },
  neutral: {
    icon: Meh,
    label: 'Neutral',
    gradient: 'from-amber-500 to-orange-500',
    glow: 'shadow-amber-500/50',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    emoji: '😐'
  }
};

export function ResultCard({ result }: ResultCardProps) {
  const config = sentimentConfig[result.sentiment];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="relative group"
    >
      {/* Animated Glow */}
      <motion.div
        className={`absolute -inset-1 bg-gradient-to-r ${config.gradient} rounded-3xl blur-xl ${config.glow} opacity-60`}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main Card */}
      <div className={`relative bg-background/90 dark:bg-background/60 backdrop-blur-2xl rounded-3xl border ${config.border} p-5 sm:p-12 shadow-2xl overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 bg-gradient-to-r ${config.gradient} rounded-full opacity-30`}
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
              }}
              animate={{
                y: [null, `${Math.random() * 100}%`],
                x: [null, `${Math.random() * 100}%`],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          {/* Sentiment Display */}
          <div className="text-center mb-8">
            {/* Emoji Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className={`relative inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-3xl ${config.bg} border-2 ${config.border}`}>
                <motion.span
                  className="text-6xl sm:text-7xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {config.emoji}
                </motion.span>
                
                {/* Pulse Ring */}
                <motion.div
                  className={`absolute inset-0 rounded-3xl border-2 ${config.border}`}
                  animate={{
                    scale: [1, 1.2, 1.2],
                    opacity: [0.5, 0, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              </div>
            </motion.div>

            {/* Sentiment Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                {config.label}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Sentiment detected with high confidence
              </p>
            </motion.div>
          </div>

          {/* Confidence Score */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className={`w-5 h-5 bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`} />
                <span className="font-medium">Confidence Score</span>
              </div>
              <span className={`text-2xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                {result.confidence}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 bg-secondary/50 rounded-full overflow-hidden">
              <motion.div
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${config.gradient} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${result.confidence}%` }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              />
              
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  delay: 1.5,
                  duration: 1.5,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border/50"
          >
            <StatItem
              label="Positive"
              value={result.scores.positive}
              color="from-green-500 to-emerald-500"
              delay={0.6}
            />
            <StatItem
              label="Neutral"
              value={result.scores.neutral}
              color="from-amber-500 to-orange-500"
              delay={0.7}
            />
            <StatItem
              label="Negative"
              value={result.scores.negative}
              color="from-red-500 to-rose-500"
              delay={0.8}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function StatItem({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="text-left sm:text-center"
    >
      <div className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-1`}>
        {value}%
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </motion.div>
  );
}
