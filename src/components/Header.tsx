import React from 'react';
import { CloudSun, Sparkles, Star, Globe, Rocket, HelpCircle } from 'lucide-react';

interface HeaderProps {
  units: 'celsius' | 'fahrenheit';
  onToggleUnits: () => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenDeployGuide: () => void;
  lastUpdated?: string;
  isAiActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  units,
  onToggleUnits,
  favoritesCount,
  onOpenFavorites,
  onOpenDeployGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
            W
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-800">
                Weather Intelligence <span className="text-indigo-600">v2.0</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Sparkles className="w-3 h-3 mr-1 text-indigo-500 animate-pulse" />
                Open-Meteo + AI
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Unit Toggle Button */}
          <button
            onClick={onToggleUnits}
            id="unit-toggle-btn"
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all duration-200"
            title="Toggle Temperature Unit"
          >
            <span className={units === 'celsius' ? 'text-indigo-600 font-extrabold' : 'text-slate-400'}>°C</span>
            <span className="text-slate-300">/</span>
            <span className={units === 'fahrenheit' ? 'text-indigo-600 font-extrabold' : 'text-slate-400'}>°F</span>
          </button>

          {/* Favorites Button */}
          <button
            onClick={onOpenFavorites}
            id="favorites-drawer-btn"
            className="relative flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all duration-200"
            title="Saved Cities"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="hidden sm:inline">Favorites</span>
            {favoritesCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Cloudflare Pages / Deployment Guide Button */}
          <button
            onClick={onOpenDeployGuide}
            id="deploy-guide-btn"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold border border-indigo-200 transition-all duration-200 shadow-sm"
            title="Cloudflare Pages Deployment Info"
          >
            <Rocket className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline font-bold">Cloudflare Deploy</span>
          </button>

        </div>
      </div>
    </header>
  );
};
