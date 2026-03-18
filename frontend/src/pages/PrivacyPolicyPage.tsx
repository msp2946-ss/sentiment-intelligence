import { motion } from 'motion/react';
import { ShieldCheck, Database, Lock, Eye } from 'lucide-react';

const principles = [
  {
    icon: ShieldCheck,
    title: 'Data Safety First',
    text: 'We design every feature with a privacy-first approach so sentiment insights stay protected and responsibly handled.',
  },
  {
    icon: Database,
    title: 'Minimal Collection',
    text: 'Only the data required to process your requests is used. We avoid unnecessary retention and keep processing focused.',
  },
  {
    icon: Lock,
    title: 'Secure Processing',
    text: 'Requests are protected in transit and validated through authenticated routes before any sensitive operation is executed.',
  },
  {
    icon: Eye,
    title: 'Transparent Policy',
    text: 'This page documents what is processed, why it is processed, and how users can request updates or removal where applicable.',
  },
];

export function PrivacyPolicyPage() {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[70vh]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-12 left-12 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute bottom-12 right-12 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Privacy Policy</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Data, Handled With Care</h1>
          <p className="text-lg text-muted-foreground mb-10">
            SentiAI is built for intelligent analysis and responsible privacy. This policy explains how information flows through the platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 mb-8">
          {principles.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * idx }}
              className="bg-background/80 dark:bg-background/40 backdrop-blur-2xl rounded-2xl border border-border/50 p-6 shadow-xl"
            >
              <item.icon className="w-6 h-6 text-blue-500 mb-3" />
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
          <h2 className="text-2xl font-semibold mb-4">Policy Story</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            When you submit text for sentiment analysis, the platform processes that input to produce the requested output. We focus on performance,
            security, and limited use of request data. Access to protected actions is gated through authenticated sessions.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Support form submissions are routed securely to configured administrators for issue resolution. Sensitive configuration values are maintained
            through environment-based secrets and should be rotated regularly in production environments.
          </p>
          <p id="cookies" className="text-sm text-muted-foreground leading-relaxed">
            Cookies/Local Storage: the web app stores authentication state locally to keep your session active. This storage is used for access control
            and user experience continuity across pages.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
