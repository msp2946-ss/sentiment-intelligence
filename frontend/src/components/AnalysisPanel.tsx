import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { analyzeSentiment, exampleTexts, type SentimentResult } from '../utils/sentimentAnalysis';
import { ResultCard } from './ResultCard';
import { InsightsPanel } from './InsightsPanel';

export function AnalysisPanel() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setResult(null);
    setError('');

    try {
      // Keep the UX pacing close to the ZIP demo while waiting for API response.
      await new Promise(resolve => setTimeout(resolve, 700));
      const analysis = await analyzeSentiment(text);
      setResult(analysis);
    } catch {
      setError('Could not reach the analysis API. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExampleClick = (exampleText: string) => {
    setText(exampleText);
    setShowSuggestions(false);
    setResult(null);
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError('');
  };

  return (
    <section id="demo" className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Try It{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Live
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Paste any text and watch the AI analyze its emotional tone
          </p>
        </motion.div>

        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative group mb-6 sm:mb-8"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          
          {/* Glass Card */}
          <div className="relative bg-background/80 dark:bg-background/40 backdrop-blur-2xl rounded-3xl border border-border/50 p-4 sm:p-8 shadow-2xl">
            {/* Textarea */}
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Paste your text and uncover its emotion…"
                className="w-full h-44 sm:h-64 p-4 bg-secondary/30 rounded-2xl border border-border/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-muted-foreground/50 text-base"
                maxLength={5000}
              />
              
              {/* Character Count */}
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                {text.length} / 5000
              </div>
            </div>

            {/* Suggestions */}
            <AnimatePresence>
              {showSuggestions && text.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <p className="text-sm text-muted-foreground mb-3">Try these examples:</p>
                  <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
                    {exampleTexts.slice(0, 3).map((example, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleExampleClick(example)}
                        className="w-full sm:w-auto px-3 py-2 text-xs bg-secondary/50 hover:bg-secondary rounded-lg border border-border/50 transition-colors text-left line-clamp-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {example.substring(0, 50)}...
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6">
              <motion.button
                onClick={handleAnalyze}
                disabled={!text.trim() || isAnalyzing}
                className="w-full sm:w-auto flex-1 sm:flex-none relative px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                whileHover={{ scale: text.trim() && !isAnalyzing ? 1.02 : 1 }}
                whileTap={{ scale: text.trim() && !isAnalyzing ? 0.98 : 1 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      AI Analyze
                    </>
                  )}
                </span>
                {!isAnalyzing && text.trim() && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>

              {text && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleClear}
                  className="w-full sm:w-auto px-6 py-3.5 bg-secondary hover:bg-secondary/80 rounded-xl font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-center py-20"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full" />
                </motion.div>
                <p className="text-lg text-muted-foreground">
                  AI is processing your text...
                </p>
              </div>
            </motion.div>
          )}

          {error && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-600"
            >
              {error}
            </motion.div>
          )}

          {result && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <ResultCard result={result} />
              <InsightsPanel result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
