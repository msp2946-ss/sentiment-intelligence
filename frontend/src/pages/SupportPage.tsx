import { FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import { LifeBuoy, Mail, Send, User, MessageSquare } from 'lucide-react';
import { buildApiUrl, withAuthHeaders } from '../utils/auth';

export function SupportPage() {
  const supportEmail = 'shreyanshji2946@gmail.com';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const parseErrorDetail = (detail: unknown): string => {
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      const first = detail[0] as { msg?: string } | undefined;
      if (first?.msg) return first.msg;
    }
    return 'Failed to send support message.';
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus(null);
    setIsSending(true);

    try {
      const response = await fetch(buildApiUrl('/api/support/contact'), {
        method: 'POST',
        headers: withAuthHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ name, email, message }),
      });

      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await response.json()
        : { detail: await response.text() };

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please login first to contact support.');
        }
        throw new Error(parseErrorDetail(data?.detail));
      }

      setStatus({ ok: true, text: 'Message sent successfully. Admin will contact you soon.' });
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      setStatus({ ok: false, text: error instanceof Error ? error.message : 'Failed to send support message.' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[70vh]">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <LifeBuoy className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-medium text-violet-600 dark:text-violet-400">Support</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Admin Support</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Send your issue directly to admin via email. We will review and respond as quickly as possible.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background/80 dark:bg-background/40 backdrop-blur-2xl rounded-2xl border border-border/50 p-6 shadow-xl space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="text-sm space-y-2 block">
              <span className="inline-flex items-center gap-2"><User className="w-4 h-4" /> Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                className="w-full rounded-xl border border-border/60 bg-background/70 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                placeholder="Your name"
              />
            </label>

            <label className="text-sm space-y-2 block">
              <span className="inline-flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-border/60 bg-background/70 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                placeholder="you@example.com"
              />
            </label>
          </div>

          <label className="text-sm space-y-2 block">
            <span className="inline-flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Message</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              minLength={10}
              rows={6}
              className="w-full rounded-xl border border-border/60 bg-background/70 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none"
              placeholder="Describe your issue..."
            />
          </label>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <button
              type="submit"
              disabled={isSending}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium shadow-lg shadow-violet-500/30"
            >
              <Send className="w-4 h-4" />
              {isSending ? 'Sending...' : 'Send Message'}
            </button>
          </div>

          {status && (
            <p className={`text-sm ${status.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {status.text}
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
