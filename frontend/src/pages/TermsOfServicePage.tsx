import { motion } from 'motion/react';
import { FileText, Scale, AlertTriangle, CheckCircle2 } from 'lucide-react';

const terms = [
  {
    icon: CheckCircle2,
    title: 'Acceptable Use',
    text: 'Use SentiAI for lawful and ethical analysis. Attempts to abuse, overload, or bypass security controls are prohibited.',
  },
  {
    icon: Scale,
    title: 'User Responsibility',
    text: 'You are responsible for the content submitted and for ensuring you have rights to analyze that content.',
  },
  {
    icon: FileText,
    title: 'Service Scope',
    text: 'The platform provides sentiment predictions and support tooling as-is, with continuous improvement but no guaranteed outcome accuracy.',
  },
  {
    icon: AlertTriangle,
    title: 'Security & Compliance',
    text: 'Credential misuse, unauthorized access, or suspicious activity can result in immediate access restrictions for system safety.',
  },
];

export function TermsOfServicePage() {
  const lastUpdated = '18 Mar 2026';

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[70vh]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-12 right-10 w-80 h-80 rounded-full bg-amber-500/12 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-orange-500/12 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <FileText className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Terms of Service</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Platform Terms & Usage Story</h1>
          <p className="text-lg text-muted-foreground mb-10">
            These terms define how SentiAI can be used responsibly while maintaining reliability, fairness, and platform security.
          </p>
          <p className="text-[12px] text-muted-foreground/80 mb-8">Last updated: {lastUpdated} - by MSP</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 mb-8">
          {terms.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * idx }}
              className="bg-background/80 dark:bg-background/40 backdrop-blur-2xl rounded-2xl border border-border/50 p-6 shadow-xl"
            >
              <item.icon className="w-6 h-6 text-amber-500 mb-3" />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background/80 dark:bg-background/40 backdrop-blur-2xl rounded-2xl border border-border/50 p-6 shadow-xl"
        >
          <h2 className="text-2xl font-semibold mb-4">Operational Terms</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            SentiAI delivers automated NLP-based sentiment classifications for product workflows, experimentation, and integration use cases.
            Predictions should be treated as analytical support, not sole decision authority.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            We reserve the right to update, pause, or limit services to protect platform stability, user safety, or legal compliance.
            Continued usage implies acceptance of updated terms.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you require enterprise compliance controls or contractual guarantees, contact support before production dependency.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
