import { motion } from 'motion/react';
import { Brain, Tag, TrendingUp } from 'lucide-react';
import type { SentimentResult } from '../utils/sentimentAnalysis';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface InsightsPanelProps {
  result: SentimentResult;
}

export function InsightsPanel({ result }: InsightsPanelProps) {
  const chartData = [
    { name: 'Positive', value: result.scores.positive, color: '#10b981' },
    { name: 'Neutral', value: result.scores.neutral, color: '#f59e0b' },
    { name: 'Negative', value: result.scores.negative, color: '#ef4444' },
  ].filter(item => item.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="grid md:grid-cols-2 gap-4 sm:gap-6"
    >
      {/* Tone Breakdown */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
        
        <div className="relative bg-background/80 dark:bg-background/40 backdrop-blur-2xl rounded-2xl border border-border/50 p-4 sm:p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold">Tone Breakdown</h3>
          </div>

          {/* Chart */}
          <div className="h-56 sm:h-64 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  formatter={(value: number | string | undefined) => `${value ?? 0}%`}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs sm:text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Percentage Bars */}
          <div className="space-y-3 mt-4">
            {chartData.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium">{item.value}%</span>
                </div>
                <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Keywords */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
        
        <div className="relative bg-background/80 dark:bg-background/40 backdrop-blur-2xl rounded-2xl border border-border/50 p-4 sm:p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <Tag className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold">Key Sentiment Words</h3>
          </div>

          {result.keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.keywords.map((keyword, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className={`group relative px-4 py-2 rounded-xl font-medium text-sm transition-all hover:scale-105 ${
                    keyword.sentiment === 'positive'
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30'
                      : keyword.sentiment === 'negative'
                      ? 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/30'
                      : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                  }`}
                >
                  <span className="relative z-10">{keyword.word}</span>
                  
                  {/* Hover Glow */}
                  <div className={`absolute inset-0 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity ${
                    keyword.sentiment === 'positive'
                      ? 'bg-green-500/30'
                      : keyword.sentiment === 'negative'
                      ? 'bg-red-500/30'
                      : 'bg-amber-500/30'
                  }`} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No specific sentiment keywords detected</p>
              <p className="text-xs mt-1">Try adding more descriptive text</p>
            </div>
          )}

          {/* AI Insight */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 pt-6 border-t border-border/50"
          >
            <div className="flex gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl h-fit">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium mb-1 text-sm">AI Insight</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.sentiment === 'positive' && "The text conveys optimistic and encouraging emotions. The language suggests satisfaction and approval."}
                  {result.sentiment === 'negative' && "The text expresses dissatisfaction or critical viewpoints. The tone indicates frustration or disappointment."}
                  {result.sentiment === 'neutral' && "The text maintains a balanced or factual tone without strong emotional indicators."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
