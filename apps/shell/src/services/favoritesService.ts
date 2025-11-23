/**
 * Favorites Service
 *
 * Manages application favorites with localStorage persistence.
 * Uses app IDs to track favorited applications.
 */

const FAVORITES_KEY = 'vision_app_favorites';

export interface FavoritesData {
  appIds: string[];
  updatedAt: string;
}

export const favoritesService = {
  /**
   * Get all favorited app IDs
   */
  getFavorites(): string[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      if (!data) return [];

      const favorites: FavoritesData = JSON.parse(data);
      return favorites.appIds || [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  },

  /**
   * Check if an app is favorited
   */
  isFavorite(appId: string): boolean {
    const favorites = this.getFavorites();
    return favorites.includes(appId);
  },

  /**
   * Add an app to favorites
   */
  addFavorite(appId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const favorites = this.getFavorites();

      if (!favorites.includes(appId)) {
        favorites.push(appId);

        const data: FavoritesData = {
          appIds: favorites,
          updatedAt: new Date().toISOString(),
        };

        localStorage.setItem(FAVORITES_KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  },

  /**
   * Remove an app from favorites
   */
  removeFavorite(appId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const favorites = this.getFavorites();
      const filtered = favorites.filter((id) => id !== appId);

      const data: FavoritesData = {
        appIds: filtered,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  },

  /**
   * Toggle favorite status for an app
   */
  toggleFavorite(appId: string): boolean {
    const isFav = this.isFavorite(appId);

    if (isFav) {
      this.removeFavorite(appId);
      return false;
    } else {
      this.addFavorite(appId);
      return true;
    }
  },

  /**
   * Clear all favorites
   */
  clearAll(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(FAVORITES_KEY);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  },

  /**
   * Get favorite count
   */
  getCount(): number {
    return this.getFavorites().length;
  },
};
