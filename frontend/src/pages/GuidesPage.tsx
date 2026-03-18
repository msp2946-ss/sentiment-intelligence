import { motion } from 'motion/react';
import { Compass, Laptop2, Server, Globe2 } from 'lucide-react';

const guides = [
  {
    icon: Laptop2,
    title: 'Local Development Guide',
    text: 'Run backend and frontend together, configure proxy, and verify API integration quickly.',
  },
  {
    icon: Server,
    title: 'Backend Training Guide',
    text: 'Train the LinearSVC model, manage artifacts, and validate sentiment output quality.',
  },
  {
    icon: Globe2,
    title: 'Hosting Guide',
    text: 'Deploy on Render/Vite host with environment variables and health endpoint checks.',
  },
];

export function GuidesPage() {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[70vh]">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <Compass className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Guides</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Integration Guides</h1>
          <p className="text-lg text-muted-foreground mb-10">Step-by-step flows for development, training, and deployment.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {guides.map((guide) => (
            <div key={guide.title} className="bg-background/80 dark:bg-background/40 backdrop-blur-2xl rounded-2xl border border-border/50 p-6 shadow-xl">
              <guide.icon className="w-6 h-6 text-amber-500 mb-3" />
              <h3 className="text-xl font-semibold mb-2">{guide.title}</h3>
              <p className="text-sm text-muted-foreground">{guide.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
