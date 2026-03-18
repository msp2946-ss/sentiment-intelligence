import { useState } from 'react';
import { motion } from 'motion/react';
import { Braces, Activity, ShieldCheck, Mail, Copy, Check, TerminalSquare, Code2 } from 'lucide-react';

export function ApiReferencePage() {
  const [copiedKey, setCopiedKey] = useState('');

  const copyText = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 1200);
    } catch {
      setCopiedKey('');
    }
  };

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

  const oauthGoogleCurl = `curl -i "${baseUrl}/api/auth/google/login?next=/"`;

  const meCurl = `curl -X GET ${baseUrl}/api/auth/me \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`;

  const predictCurl = `curl -X POST ${baseUrl}/api/predict \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"text":"This product is great and easy to use."}'`;

  const predictJs = `const token = localStorage.getItem('sentiai_token');

const response = await fetch('${baseUrl}/api/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: \`Bearer \${token}\`
  },
  body: JSON.stringify({ text: 'This product is great and easy to use.' })
});

const data = await response.json();
console.log(data);`;

  const bulkCurl = `curl -X POST ${baseUrl}/api/predict-bulk \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"texts":["Amazing support","Average delivery","Worst experience"]}'`;

  const supportCurl = `curl -X POST ${baseUrl}/api/support/contact \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John Doe","email":"john@example.com","message":"Need help with API integration."}'`;

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[70vh]">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Braces className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">API Reference</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">REST API Reference</h1>
          <p className="text-lg text-muted-foreground mb-10">
            Current live API contract for SentiAI website including OAuth login flow and protected analysis endpoints.
          </p>
        </motion.div>

        <div className="bg-background/80 dark:bg-background/40 backdrop-blur-2xl rounded-2xl border border-border/50 p-6 shadow-xl mb-6">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <TerminalSquare className="w-5 h-5 text-emerald-500" />
            Quick Setup
          </h2>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li><strong>Base URL:</strong> <code>{baseUrl}</code></li>
            <li><strong>Content-Type:</strong> <code>application/json</code></li>
            <li><strong>Auth:</strong> OAuth (Google/GitHub) issues JWT; send <code>Authorization: Bearer &lt;token&gt;</code> for protected endpoints</li>
            <li><strong>Public Endpoints:</strong> <code>/</code>, <code>/api/health</code>, <code>/api/auth/google/login</code>, <code>/api/auth/github/login</code></li>
            <li><strong>Protected Endpoints:</strong> <code>/api/auth/me</code>, <code>/api/predict</code>, <code>/api/predict-bulk</code>, <code>/api/support/contact</code></li>
            <li><strong>CORS:</strong> Configured by backend using <code>FRONTEND_ORIGIN</code></li>
          </ul>
        </div>

        <div className="bg-background/80 dark:bg-background/40 backdrop-blur-2xl rounded-2xl border border-border/50 p-6 shadow-xl mb-6">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            Current Website API Status
          </h2>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>OAuth login is active with Google and GitHub providers.</li>
            <li>Sentiment analysis endpoints require JWT authentication.</li>
            <li>Support form submits through backend SMTP endpoint.</li>
            <li>Health check is available for uptime monitoring.</li>
          </ul>
        </div>

        <div className="space-y-4 mb-8">
          <ApiCard icon={Activity} method="GET" endpoint="/api/health" desc="Health status endpoint for uptime checks." response={`{"status":"ok"}`} />
          <ApiCard icon={ShieldCheck} method="GET" endpoint="/api/auth/google/login?next=/" desc="Starts Google OAuth flow and redirects to Google consent." response={`302 Redirect to Google OAuth`} />
          <ApiCard icon={ShieldCheck} method="GET" endpoint="/api/auth/github/login?next=/" desc="Starts GitHub OAuth flow and redirects to GitHub consent." response={`302 Redirect to GitHub OAuth`} />
          <ApiCard icon={ShieldCheck} method="GET" endpoint="/api/auth/me" desc="Returns authenticated user profile from JWT token." response={`{"sub":"12345","name":"User Name","email":"user@example.com","provider":"google"}`} />
          <ApiCard icon={Braces} method="POST" endpoint="/api/predict" desc="Single text sentiment analysis. Requires JWT token." response={`{"sentiment":"Positive","confidence":0.91,"probabilities":{"positive":0.91,"neutral":0.05,"negative":0.04}}`} />
          <ApiCard icon={Braces} method="POST" endpoint="/api/predict-bulk" desc="Batch sentiment analysis for text array. Requires JWT token." response={`{"results":[{"sentiment":"Positive","confidence":0.88,"probabilities":{"positive":0.88,"neutral":0.07,"negative":0.05}}]}`} />
          <ApiCard icon={Mail} method="POST" endpoint="/api/support/contact" desc="Sends support email through backend SMTP. Requires JWT token." response={`{"success":true,"detail":"Support message sent successfully."}`} />
        </div>

        <div className="space-y-6">
          <CodeBlock
            title="cURL: Start Google OAuth"
            icon={TerminalSquare}
            code={oauthGoogleCurl}
            copyKey="oauth-google-curl"
            copiedKey={copiedKey}
            onCopy={copyText}
          />

          <CodeBlock
            title="cURL: Get Current User (/api/auth/me)"
            icon={TerminalSquare}
            code={meCurl}
            copyKey="me-curl"
            copiedKey={copiedKey}
            onCopy={copyText}
          />

          <CodeBlock
            title="cURL: Predict Sentiment"
            icon={TerminalSquare}
            code={predictCurl}
            copyKey="predict-curl"
            copiedKey={copiedKey}
            onCopy={copyText}
          />

          <CodeBlock
            title="JavaScript (Fetch): Predict Sentiment"
            icon={Code2}
            code={predictJs}
            copyKey="predict-js"
            copiedKey={copiedKey}
            onCopy={copyText}
          />

          <CodeBlock
            title="cURL: Bulk Predict"
            icon={TerminalSquare}
            code={bulkCurl}
            copyKey="bulk-curl"
            copiedKey={copiedKey}
            onCopy={copyText}
          />

          <CodeBlock
            title="cURL: Support Contact"
            icon={TerminalSquare}
            code={supportCurl}
            copyKey="support-curl"
            copiedKey={copiedKey}
            onCopy={copyText}
          />
        </div>
      </div>
    </section>
  );
}

function ApiCard({
  icon: Icon,
  method,
  endpoint,
  desc,
  response,
}: {
  icon: React.ElementType;
  method: string;
  endpoint: string;
  desc: string;
  response: string;
}) {
  return (
    <div className="bg-background/80 dark:bg-background/40 backdrop-blur-2xl rounded-2xl border border-border/50 p-5 shadow-xl">
      <div className="flex items-start gap-4 mb-3">
        <Icon className="w-5 h-5 text-emerald-500 mt-1" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">{method}</span>
            <code className="text-sm">{endpoint}</code>
          </div>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-black/90 text-emerald-300 p-3 overflow-x-auto">
        <pre className="text-xs leading-relaxed whitespace-pre-wrap">{response}</pre>
      </div>
    </div>
  );
}

function CodeBlock({
  title,
  icon: Icon,
  code,
  copyKey,
  copiedKey,
  onCopy,
}: {
  title: string;
  icon: React.ElementType;
  code: string;
  copyKey: string;
  copiedKey: string;
  onCopy: (key: string, value: string) => void;
}) {
  return (
    <div className="bg-background/80 dark:bg-background/40 backdrop-blur-2xl rounded-2xl border border-border/50 p-5 shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>

        <button
          type="button"
          onClick={() => onCopy(copyKey, code)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border border-border/60 hover:bg-secondary/70"
        >
          {copiedKey === copyKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copiedKey === copyKey ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="rounded-xl border border-border/50 bg-black/90 text-emerald-300 p-3 overflow-x-auto">
        <pre className="text-xs leading-relaxed whitespace-pre-wrap">{code}</pre>
      </div>
    </div>
  );
}
