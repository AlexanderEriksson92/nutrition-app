import type { SwedishFood } from '../data/rdi';

// Vi definierar Product här lokalt eftersom den bara behövs för sök/spar-logiken
export interface Product {
  _id: string;
  product_name: string;
  brands?: string;
  localData?: SwedishFood;
  isCustom?: boolean;
}

const STORAGE_KEY = 'custom-meals';

export const mealStore = {
  getAll: (): Product[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  save: (name: string, nutrients: any) => {
    const currentMeals = mealStore.getAll();
    const newMeal: Product = {
      _id: `custom-${Date.now()}`,
      product_name: name,
      brands: "Hemlagat",
      // Vi sprider ut näringen i localData så den matchar SwedishFood-formatet
      localData: { ...nutrients, defaultAmount: 100 } as SwedishFood,
      isCustom: true
    };
    
    const updated = [newMeal, ...currentMeals];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  remove: (id: string) => {
    const updated = mealStore.getAll().filter(m => m._id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
};