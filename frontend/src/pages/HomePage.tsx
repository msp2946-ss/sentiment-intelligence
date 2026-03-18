import { Hero } from '../components/Hero';
import { AnalysisPanel } from '../components/AnalysisPanel';
import { FeaturesSection } from '../components/FeaturesSection';
import { ExamplesSection } from '../components/ExamplesSection';

export function HomePage() {
  return (
    <>
      <Hero />
      <AnalysisPanel />
      <FeaturesSection />
      <ExamplesSection />
    </>
  );
}
