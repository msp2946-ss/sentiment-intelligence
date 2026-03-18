import { buildApiUrl, withAuthHeaders } from './auth';

export interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  scores: {
    positive: number;
    neutral: number;
    negative: number;
  };
  keywords: Array<{ word: string; sentiment: 'positive' | 'negative' | 'neutral' }>;
}

type ApiPredictResponse = {
  sentiment: string;
  confidence?: number;
  probabilities?: Record<string, number>;
};

function toUiResult(apiResponse: ApiPredictResponse): SentimentResult {
  const raw = (apiResponse.sentiment || '').toLowerCase();
  const sentiment: SentimentResult['sentiment'] =
    raw === 'pos' || raw === 'positive'
      ? 'positive'
      : raw === 'neg' || raw === 'negative'
        ? 'negative'
        : 'neutral';

  const confidenceFromApi = typeof apiResponse.confidence === 'number'
    ? apiResponse.confidence
    : 0;

  const confidence = confidenceFromApi <= 1
    ? Math.round(confidenceFromApi * 100)
    : Math.round(confidenceFromApi);

  const apiPositive = Number(apiResponse.probabilities?.positive);
  const apiNeutral = Number(apiResponse.probabilities?.neutral);
  const apiNegative = Number(apiResponse.probabilities?.negative);

  let scores = { positive: 20, neutral: 60, negative: 20 };
  if (Number.isFinite(apiPositive) && Number.isFinite(apiNeutral) && Number.isFinite(apiNegative)) {
    scores = {
      positive: Math.max(0, apiPositive),
      neutral: Math.max(0, apiNeutral),
      negative: Math.max(0, apiNegative),
    };
  } else {
    if (sentiment === 'positive') scores = { positive: Math.max(confidence, 55), neutral: 100 - Math.max(confidence, 55), negative: 0 };
    if (sentiment === 'negative') scores = { positive: 0, neutral: 100 - Math.max(confidence, 55), negative: Math.max(confidence, 55) };
  }

  const total = scores.positive + scores.neutral + scores.negative || 1;
  scores = {
    positive: Math.round((scores.positive / total) * 100),
    neutral: Math.round((scores.neutral / total) * 100),
    negative: Math.round((scores.negative / total) * 100),
  };

  return {
    sentiment,
    confidence: Math.max(0, Math.min(100, confidence)),
    scores,
    keywords: [],
  };
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  const endpoint = buildApiUrl('/api/predict');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: withAuthHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Please login with Google or GitHub to analyze sentiment.');
    }
    throw new Error(`Prediction failed with status ${response.status}`);
  }

  const data = (await response.json()) as ApiPredictResponse;
  return toUiResult(data);
}

export const exampleTexts = [
  "This product exceeded all my expectations! Absolutely amazing quality and the customer service was outstanding. Highly recommend!",
  "I'm extremely disappointed with this purchase. The quality is terrible and it stopped working after just two days. Complete waste of money.",
  "The item arrived on time and matches the description. It's okay for the price, nothing special but gets the job done.",
  "Wow! This is exactly what I needed. The design is beautiful and it works perfectly. Thank you so much!",
  "Frustrated with the experience. Poor communication, delayed delivery, and the product itself is subpar. Would not buy again."
];
