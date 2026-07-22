import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Activity,
  Shirt,
  Car,
  ShieldAlert,
  HelpCircle,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lightbulb,
  RefreshCw,
  Umbrella,
  Glasses,
  Sun,
  Droplets,
} from 'lucide-react';
import { WeatherData, AIRecommendationData } from '../types';
import { fetchAIRecommendations } from '../services/aiRecommendationEngine';

interface PlanningRecommendationsViewProps {
  weather: WeatherData;
}

export const PlanningRecommendationsView: React.FC<PlanningRecommendationsViewProps> = ({ weather }) => {
  const [recommendations, setRecommendations] = useState<AIRecommendationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'activities' | 'clothing' | 'commute' | 'health' | 'assistant'>('activities');
  
  // Custom AI Question
  const [customPrompt, setCustomPrompt] = useState('');
  const [assistantResponse, setAssistantResponse] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const loadRecommendations = async () => {
    setIsLoading(true);
    const data = await fetchAIRecommendations(weather);
    setRecommendations(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadRecommendations();
    setAssistantResponse(null);
  }, [weather.location.name, weather.units]);

  const handleAskAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsAsking(true);
    const data = await fetchAIRecommendations(weather, customPrompt.trim());
    setAssistantResponse(data.summary || 'Generated weather insight.');
    setIsAsking(false);
  };

  const getSuitabilityBadge = (suitability: 'Optimal' | 'Caution' | 'Unfavorable') => {
    switch (suitability) {
      case 'Optimal':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Optimal
          </span>
        );
      case 'Caution':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Caution
          </span>
        );
      case 'Unfavorable':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
            Unfavorable
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">💡</span>
            <h3 className="text-lg font-bold text-slate-800">Planning Insights</h3>
            {recommendations?.isAiGenerated && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 font-bold">
                Gemini 3.6
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personalized activity suitability, clothing planner, commute alerts, and UV safety.
          </p>
        </div>

        <button
          onClick={loadRecommendations}
          disabled={isLoading}
          id="refresh-ai-insights-btn"
          className="self-start sm:self-auto px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 flex items-center space-x-1.5 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          <span>Regenerate</span>
        </button>
      </div>

      {/* Briefing Box */}
      {isLoading ? (
        <div className="p-8 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-100">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-sm text-slate-600">Synthesizing meteorological intelligence for {weather.location.name}...</p>
        </div>
      ) : (
        recommendations && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 text-sm leading-relaxed">
            <p className="text-xs font-bold text-indigo-600 uppercase mb-1">Executive Summary</p>
            <p className="font-medium text-slate-700">{recommendations.summary}</p>
          </div>
        )
      )}

      {/* Tabs */}
      <div className="flex space-x-1 p-1 bg-slate-100 rounded-full border border-slate-200 overflow-x-auto text-xs font-semibold scrollbar-none">
        <button
          onClick={() => setActiveTab('activities')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
            activeTab === 'activities'
              ? 'bg-indigo-600 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Activity Advisor</span>
        </button>

        <button
          onClick={() => setActiveTab('clothing')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
            activeTab === 'clothing'
              ? 'bg-indigo-600 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shirt className="w-3.5 h-3.5" />
          <span>Clothing & Gear</span>
        </button>

        <button
          onClick={() => setActiveTab('commute')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
            activeTab === 'commute'
              ? 'bg-indigo-600 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span>Travel & Commute</span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
            activeTab === 'health'
              ? 'bg-indigo-600 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Health & UV</span>
        </button>

        <button
          onClick={() => setActiveTab('assistant')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
            activeTab === 'assistant'
              ? 'bg-indigo-600 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Ask Weather AI</span>
        </button>
      </div>

      {/* Tab Content */}
      {recommendations && (
        <div className="pt-2">
          
          {/* TAB 1: ACTIVITIES */}
          {activeTab === 'activities' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendations.activityRecommendations.map((act, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-800">{act.activity}</h4>
                    {getSuitabilityBadge(act.suitability)}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{act.rationale}</p>

                  <div className="pt-1 text-[11px] text-indigo-600 font-bold flex items-center">
                    <span className="text-slate-400 mr-1 font-normal">Best window:</span>
                    {act.bestTimeWindow}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: CLOTHING */}
          {activeTab === 'clothing' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-amber-600 uppercase">
                  Outfit Intelligence
                </h4>
                <p className="text-sm text-slate-600">{recommendations.clothingPlanner.summary}</p>
              </div>

              {/* Items to bring */}
              <div>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Recommended Items to Bring
                </h5>
                <div className="flex flex-wrap gap-2">
                  {recommendations.clothingPlanner.itemsToBring.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full bg-slate-100 text-xs text-slate-700 border border-slate-200 flex items-center space-x-1.5 font-semibold"
                    >
                      <Umbrella className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Layering advice */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <h5 className="text-xs font-bold text-indigo-600 uppercase">Layering Strategy</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {recommendations.clothingPlanner.layeringAdvice}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: COMMUTE */}
          {activeTab === 'commute' && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex items-center space-x-2 text-indigo-600 font-bold text-sm">
                <Car className="w-5 h-5" />
                <span>Road & Transit Briefing</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {recommendations.commuteTravelAdvice}
              </p>
            </div>
          )}

          {/* TAB 4: HEALTH */}
          {activeTab === 'health' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-2">
                <h4 className="text-xs font-bold text-amber-700 flex items-center">
                  <Sun className="w-4 h-4 mr-1.5" />
                  UV Protection Precaution
                </h4>
                <p className="text-xs text-amber-900 leading-relaxed">
                  {recommendations.healthSafety.uvPrecaution}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-2">
                <h4 className="text-xs font-bold text-blue-700 flex items-center">
                  <Droplets className="w-4 h-4 mr-1.5" />
                  Air Freshness & Hydration
                </h4>
                <p className="text-xs text-blue-900 leading-relaxed">
                  {recommendations.healthSafety.airQualityOrComfort}
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: ASK WEATHER AI */}
          {activeTab === 'assistant' && (
            <div className="space-y-4">
              <form onSubmit={handleAskAssistant} className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Ask AI Assistant specific planning questions for {weather.location.name}:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g., Should I wash my car today? Is 4 PM good for tennis?"
                    className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                  <button
                    type="submit"
                    disabled={isAsking || !customPrompt.trim()}
                    className="px-4 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white flex items-center space-x-1.5 transition-all disabled:opacity-50"
                  >
                    {isAsking ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Ask AI</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {assistantResponse && (
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2 animate-fadeIn">
                  <h5 className="text-xs font-bold text-indigo-700 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                    AI Assistant Advice:
                  </h5>
                  <p className="text-xs text-slate-700 leading-relaxed">{assistantResponse}</p>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* Deployed via Cloudflare callout box from Sleek Interface design */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold opacity-60 uppercase tracking-wider">Deployed via</span>
          <span className="px-2 py-0.5 bg-emerald-500 rounded text-[10px] font-bold text-slate-950">ACTIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span className="text-sm font-mono truncate text-slate-200">weather-intel.pages.dev</span>
        </div>
      </div>

    </div>
  );
};
