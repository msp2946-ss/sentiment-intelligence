import { motion } from 'motion/react';
import { Gauge, BrainCircuit, Sparkles, Braces, ShieldCheck, Globe2, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: Gauge,
    title: 'Real-time Processing',
    description: 'Instant sentiment analysis with sub-second response times powered by advanced AI models.',
    gradient: 'from-yellow-500 to-orange-500',
    delay: 0
  },
  {
    icon: BrainCircuit,
    title: 'AI-Powered Accuracy',
    description: 'LinearSVC + NLP classification tuned for reliable Positive, Neutral, and Negative detection with confidence scoring.',
    gradient: 'from-purple-500 to-pink-500',
    delay: 0.1
  },
  {
    icon: Sparkles,
    title: 'Clean & Intuitive',
    description: 'Beautiful, user-friendly interface designed for seamless interaction and visual delight.',
    gradient: 'from-blue-500 to-cyan-500',
    delay: 0.2
  },
  {
    icon: Braces,
    title: 'Developer API',
    description: 'Simple REST endpoints with clean JSON responses for fast frontend and service integration.',
    gradient: 'from-green-500 to-emerald-500',
    delay: 0.3
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    description: 'Your data is processed securely with enterprise-grade encryption and privacy protection.',
    gradient: 'from-red-500 to-rose-500',
    delay: 0.4
  },
  {
    icon: Globe2,
    title: 'Multi-language',
    description: 'Support for multiple languages and contextual understanding across different cultures.',
    gradient: 'from-indigo-500 to-purple-500',
    delay: 0.5
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Powerful Features
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              SentiAI
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with cutting-edge technology to deliver the most accurate and reliable sentiment analysis
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description, gradient, delay }: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="group relative"
    >
      {/* Glow Effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-500`} />
      
      {/* Card */}
      <div className="relative bg-background/80 dark:bg-background/40 backdrop-blur-2xl rounded-2xl border border-border/50 p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
        <div className="absolute top-4 right-4 opacity-20">
          <Icon className="w-10 h-10" />
        </div>

        {/* Icon */}
        {/* Content */}
        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 leading-snug">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed text-left min-h-[72px]">
          {description}
        </p>

        {/* Hover Arrow */}
        <motion.div className={`mt-4 inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${gradient} bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity`}>
          Learn more
          <ArrowUpRight className="w-4 h-4" />
        </motion.div>
      </div>
    </motion.div>
  );
}
