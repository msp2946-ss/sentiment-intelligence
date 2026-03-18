import { motion } from 'motion/react';
import { MessageSquareText, ArrowRight, BadgeCheck, CircleX, Scale, WandSparkles, ScanText } from 'lucide-react';
import { exampleTexts } from '../utils/sentimentAnalysis';

const examples = [
  {
    text: exampleTexts[0],
    sentiment: 'positive' as const,
    icon: BadgeCheck,
    gradient: 'from-green-500 to-emerald-500',
    badge: 'Positive',
    emoji: '▲'
  },
  {
    text: exampleTexts[1],
    sentiment: 'negative' as const,
    icon: CircleX,
    gradient: 'from-red-500 to-rose-500',
    badge: 'Negative',
    emoji: '▼'
  },
  {
    text: exampleTexts[2],
    sentiment: 'neutral' as const,
    icon: Scale,
    gradient: 'from-amber-500 to-orange-500',
    badge: 'Neutral',
    emoji: '•'
  }
];

export function ExamplesSection() {
  return (
    <section id="examples" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <WandSparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Live Sentiment Examples</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            See It{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              In Action
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real examples showing how our AI analyzes different types of sentiment
          </p>
        </motion.div>

        {/* Examples Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <ExampleCard key={index} {...example} delay={index * 0.1} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.a
            href="#demo"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Your Own Text
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

function ExampleCard({ text, sentiment, icon: Icon, gradient, badge, emoji, delay }: {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  gradient: string;
  badge: string;
  emoji: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group relative"
    >
      {/* Glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
      
      {/* Card */}
      <div className="relative bg-background/80 dark:bg-background/40 backdrop-blur-2xl rounded-2xl border border-border/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
        <div className="absolute top-4 right-4 opacity-20">
          <ScanText className="w-10 h-10" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${gradient} text-white`}>
              {badge}
            </span>
          </div>
          <MessageSquareText className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Content */}
        <div className="flex-1 min-h-[110px]">
          <p className="text-sm text-muted-foreground leading-relaxed text-left break-words">
            "{text}"
          </p>
        </div>

        {/* Analysis Preview */}
        <motion.div
          className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          <span className="font-bold">{emoji}</span>
          <span>AI detected {badge.toLowerCase()} sentiment</span>
        </motion.div>

        {/* Hover Effect */}
        <motion.div
          className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${gradient} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity`}
          layoutId={`underline-${sentiment}`}
        />
      </div>
    </motion.div>
  );
}
