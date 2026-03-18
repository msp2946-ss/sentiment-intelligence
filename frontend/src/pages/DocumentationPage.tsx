import { motion } from 'motion/react';
import { BookOpenText, FileStack, Rocket } from 'lucide-react';

export function DocumentationPage() {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[70vh]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />
      </div>

      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <BookOpenText className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Documentation</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Product Documentation</h1>
          <p className="text-lg text-muted-foreground mb-10">
            Everything you need to run, configure, and deploy Sentiment Intelligence with confidence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          <DocCard icon={Rocket} title="Quick Start" text="Install dependencies, run backend/frontend, and test sentiment predictions in minutes." />
          <DocCard icon={FileStack} title="Configuration" text="Environment variables for API base URL, CORS, and support contact email." />
          <DocCard icon={BookOpenText} title="Deployment" text="Production notes for Render, health checks, and model startup behavior." />
        </div>
      </div>
    </section>
  );
}

function DocCard({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  return (
    <div className="bg-background/80 dark:bg-background/40 backdrop-blur-2xl rounded-2xl border border-border/50 p-6 shadow-xl">
      <Icon className="w-6 h-6 text-blue-500 mb-3" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
