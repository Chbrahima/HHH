const DB_PREFIX = 'pressy_';

export const db = {
  getItem: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(`${DB_PREFIX}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage`, error);
      localStorage.removeItem(`${DB_PREFIX}${key}`); // Clear corrupted item
      return null;
    }
  },

  setItem: <T>(key: string, value: T): void => {
    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(`${DB_PREFIX}${key}`);
        return;
      }
      const item = JSON.stringify(value);
      localStorage.setItem(`${DB_PREFIX}${key}`, item);
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage`, error);
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(`${DB_PREFIX}${key}`);
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage`, error);
    }
  },
};
