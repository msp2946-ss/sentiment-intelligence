import React, { useState } from 'react';
import SentimentInput from './components/SentimentInput';
import ResultsCard from './components/ResultsCard';
import { Activity, LayoutDashboard, Settings } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lastResult, setLastResult] = useState(null);

  return (
    <div className="min-h-screen text-gray-800 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* Sidebar / Navigation */}
      <nav className="fixed top-0 left-0 h-full w-64 bg-white/60 backdrop-blur-xl border-r border-white/40 shadow-sm flex flex-col hidden md:flex transition-all duration-300">
        <div className="p-8">
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-1">
            <span className="text-blue-600">Anti</span>
            <span className="text-red-500">grav</span>
            <span className="text-yellow-500">ity</span>
            <span className="text-green-600">.AI</span>
          </h1>
        </div>
        <div className="flex-1 px-4 space-y-2">
          <NavButton
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
          />
          <NavButton
            active={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
            icon={<Activity size={20} />}
            label="Analytics"
          />
        </div>
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center gap-3 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer font-medium">
            <Settings size={18} />
            <span>Settings</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen px-4 py-8 md:p-8 lg:px-16 lg:py-12 relative overflow-hidden flex flex-col">

        {/* Top Right Header Buttons */}
        <div className="absolute top-8 right-8 z-20 flex gap-4">
          {/* Updated Buttons */}
          <button
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium shadow-md transition-all"
            onClick={() => window.open('https://portfolio-msp.vercel.app/', '_blank')}
          >
            Portfolio
          </button>
          <button
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-sm font-medium shadow-md transition-all"
            onClick={() => window.open('', '_blank')}
          >
            Status
          </button>
        </div>

        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 relative z-10 flex-1 w-full flex flex-col justify-center">
          <header className="flex flex-col justify-center h-full pt-10">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">Sentiment Intelligence</h2>
            <p className="text-gray-600 text-lg md:text-2xl">Experience weightless, real-time feedback analysis with a sleek interface.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <SentimentInput onResult={setLastResult} />
            </div>
            <div>
              <ResultsCard result={lastResult} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-200/50 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Shreyansh. All rights reserved.
          </div>

          <a
            href="mailto:Mspji70@gmail.com"
            className="flex items-center gap-2 hover:text-blue-600 transition-colors px-4 py-2 rounded-full hover:bg-blue-50"
          >
            <span>Need Help?</span>
            <span className="font-semibold text-blue-500">Contact Support</span>
          </a>
        </footer>
      </main>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
        active
          ? "bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100"
          : "text-gray-500 hover:bg-white/50 hover:text-gray-900"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default App;
