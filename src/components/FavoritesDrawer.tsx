import React from 'react';
import { X, Star, Trash2, MapPin, ArrowRight } from 'lucide-react';
import { FavoriteCity, CityLocation } from '../types';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteCity[];
  onSelectFavorite: (city: CityLocation) => void;
  onRemoveFavorite: (id: number) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectFavorite,
  onRemoveFavorite,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 text-white h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            <h3 className="text-lg font-bold text-white">Saved Cities</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
              {favorites.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Favorites List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {favorites.length === 0 ? (
            <div className="p-8 text-center space-y-3 text-slate-400">
              <Star className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-medium">No saved favorite cities yet.</p>
              <p className="text-xs text-slate-500">
                Click the star icon next to any city to bookmark it for instant access.
              </p>
            </div>
          ) : (
            favorites.map((city) => (
              <div
                key={city.id}
                className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group"
              >
                <button
                  onClick={() => {
                    onSelectFavorite({
                      id: city.id,
                      name: city.name,
                      latitude: city.latitude,
                      longitude: city.longitude,
                      country: city.country,
                      admin1: city.admin1,
                    });
                    onClose();
                  }}
                  className="flex-1 text-left flex items-center space-x-3 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                      {city.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {[city.admin1, city.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onRemoveFavorite(city.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Remove favorite"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
