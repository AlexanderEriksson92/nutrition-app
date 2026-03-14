export interface SwedishFood {
  name: string;
  calories: number;
  protein: number;
  fat: number;    // Tillagd för komplett makro-koll
  carbs: number;  // Tillagd för komplett makro-koll
  fiber: number;
  omega3: number;
  // Vitaminer
  vitaminA: number;
  vitaminC: number;
  vitaminD: number;
  vitaminE: number;
  vitaminK: number;
  b1: number;
  b2: number;
  b3: number;
  b5: number;
  b6: number;
  b7: number;
  b12: number;
  folate: number;
  // Mineraler
  iron: number;
  calcium: number;
  iodine: number;
  magnesium: number;
  zinc: number;
  potassium: number;
  selenium: number;
  copper: number;
  manganese: number;
  defaultAmount?: number; // Vikten i gram för 1 styck
}

export const SWEDISH_FOODS: SwedishFood[] = [
  // --- PROTEIN (FISK/KÖTT/ÄGG) ---
  { name: "Ägg", calories: 140, protein: 12.4, fat: 10.0, carbs: 1.0, fiber: 0, omega3: 0.4, vitaminA: 220, vitaminC: 0, vitaminD: 3.7, vitaminE: 1.5, vitaminK: 0.3, b1: 0.06, b2: 0.4, b3: 0.1, b5: 1.3, b6: 0.1, b7: 18, b12: 1.5, folate: 65, iron: 2.0, calcium: 50, iodine: 25, magnesium: 12, zinc: 1.1, potassium: 125, selenium: 25, copper: 0.05, manganese: 0.02, defaultAmount: 55 },
  { name: "Köttbullar (stekta)", calories: 250, protein: 14.0, fat: 18.0, carbs: 7.0, fiber: 1.5, omega3: 0.1, vitaminA: 10, vitaminC: 0, vitaminD: 0.2, vitaminE: 0.3, vitaminK: 1.5, b1: 0.1, b2: 0.15, b3: 4.0, b5: 0.5, b6: 0.2, b7: 2, b12: 1.2, folate: 5, iron: 1.5, calcium: 25, iodine: 5, magnesium: 18, zinc: 2.5, potassium: 300, selenium: 10, copper: 0.1, manganese: 0.05, defaultAmount: 14 },
  { name: "Kycklingbröst filé", calories: 105, protein: 23.1, fat: 1.2, carbs: 0, fiber: 0, omega3: 0.03, vitaminA: 6, vitaminC: 0, vitaminD: 0, vitaminE: 0.3, vitaminK: 0, b1: 0.07, b2: 0.1, b3: 11.4, b5: 1.5, b6: 0.6, b7: 1, b12: 0.4, folate: 5, iron: 0.7, calcium: 11, iodine: 4, magnesium: 28, zinc: 1.0, potassium: 330, selenium: 25, copper: 0.04, manganese: 0.02, defaultAmount: 150 },
  { name: "Lax (stekt/ugnsbakad)", calories: 210, protein: 24.0, fat: 13.0, carbs: 0, fiber: 0, omega3: 2.5, vitaminA: 20, vitaminC: 0, vitaminD: 10.0, vitaminE: 3.0, vitaminK: 0.1, b1: 0.2, b2: 0.1, b3: 9.0, b5: 1.6, b6: 0.9, b7: 6, b12: 4.5, folate: 8, iron: 0.4, calcium: 15, iodine: 40, magnesium: 30, zinc: 0.5, potassium: 450, selenium: 35, copper: 0.06, manganese: 0.02, defaultAmount: 125 },
  { name: "Nötfärs 10%", calories: 150, protein: 19.3, fat: 10.0, carbs: 0, fiber: 0, omega3: 0.05, vitaminA: 5, vitaminC: 0, vitaminD: 0.1, vitaminE: 0.2, vitaminK: 1.2, b1: 0.05, b2: 0.2, b3: 5.5, b5: 0.6, b6: 0.4, b7: 2, b12: 2.0, folate: 7, iron: 2.4, calcium: 10, iodine: 3, magnesium: 19, zinc: 4.5, potassium: 320, selenium: 15, copper: 0.08, manganese: 0.01, defaultAmount: 125 },
  { name: "Tonfisk (konserv i vatten)", calories: 110, protein: 25.0, fat: 0.5, carbs: 0, fiber: 0, omega3: 0.1, vitaminA: 20, vitaminC: 0, vitaminD: 2.0, vitaminE: 0.5, vitaminK: 0, b1: 0.04, b2: 0.1, b3: 13.0, b5: 0.3, b6: 0.4, b7: 1, b12: 3.0, folate: 5, iron: 1.2, calcium: 10, iodine: 30, magnesium: 30, zinc: 0.8, potassium: 300, selenium: 70, copper: 0.05, manganese: 0.02, defaultAmount: 120 },

  // --- KOLHYDRATER ---
  { name: "Riskakor", calories: 380, protein: 7.0, fat: 3.0, carbs: 80.0, fiber: 3.5, omega3: 0.1, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.5, vitaminK: 0, b1: 0.2, b2: 0.05, b3: 4.0, b5: 0.8, b6: 0.3, b7: 3, b12: 0, folate: 15, iron: 1.1, calcium: 10, iodine: 0, magnesium: 110, zinc: 1.5, potassium: 250, selenium: 5, copper: 0.2, manganese: 1.5, defaultAmount: 10 },
  { name: "Potatis (kokt)", calories: 77, protein: 1.8, fat: 0.1, carbs: 16.0, fiber: 1.4, omega3: 0.01, vitaminA: 0, vitaminC: 11, vitaminD: 0, vitaminE: 0.05, vitaminK: 0.2, b1: 0.1, b2: 0.03, b3: 1.1, b5: 0.3, b6: 0.2, b7: 0.1, b12: 0, folate: 15, iron: 0.6, calcium: 5, iodine: 1, magnesium: 20, zinc: 0.3, potassium: 400, selenium: 0.5, copper: 0.1, manganese: 0.15, defaultAmount: 65 },
  { name: "Havregryn", calories: 370, protein: 12.9, fat: 7.0, carbs: 58.0, fiber: 10.1, omega3: 0.1, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 1.5, vitaminK: 2.0, b1: 0.6, b2: 0.1, b3: 1.0, b5: 1.1, b6: 0.1, b7: 15, b12: 0, folate: 56, iron: 5.3, calcium: 54, iodine: 1, magnesium: 129, zinc: 3.2, potassium: 350, selenium: 10, copper: 0.4, manganese: 4.5, defaultAmount: 40 },
  { name: "Rågbröd (grovt)", calories: 250, protein: 9.0, fat: 2.0, carbs: 45.0, fiber: 12.0, omega3: 0.2, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.5, vitaminK: 1.0, b1: 0.2, b2: 0.1, b3: 2.5, b5: 0.5, b6: 0.2, b7: 5, b12: 0, folate: 45, iron: 3.5, calcium: 40, iodine: 5, magnesium: 80, zinc: 2.5, potassium: 350, selenium: 15, copper: 0.3, manganese: 2.5, defaultAmount: 40 },

  // --- FRUKT & GRÖNT ---
  { name: "Banan", calories: 95, protein: 1.1, fat: 0.3, carbs: 22.0, fiber: 2.6, omega3: 0.03, vitaminA: 3, vitaminC: 9, vitaminD: 0, vitaminE: 0.1, vitaminK: 0.5, b1: 0.03, b2: 0.07, b3: 0.7, b5: 0.3, b6: 0.4, b7: 0.2, b12: 0, folate: 20, iron: 0.3, calcium: 5, iodine: 0, magnesium: 27, zinc: 0.2, potassium: 358, selenium: 1, copper: 0.08, manganese: 0.3, defaultAmount: 110 },
  { name: "Äpple", calories: 52, protein: 0.3, fat: 0.2, carbs: 12.0, fiber: 2.4, omega3: 0.01, vitaminA: 3, vitaminC: 6, vitaminD: 0, vitaminE: 0.2, vitaminK: 2.2, b1: 0.02, b2: 0.03, b3: 0.1, b5: 0.1, b6: 0.04, b7: 0.1, b12: 0, folate: 3, iron: 0.1, calcium: 6, iodine: 0, magnesium: 5, zinc: 0.05, potassium: 110, selenium: 0.1, copper: 0.03, manganese: 0.04, defaultAmount: 125 },
  { name: "Kiwi", calories: 61, protein: 1.1, fat: 0.5, carbs: 15.0, fiber: 3.0, omega3: 0.04, vitaminA: 4, vitaminC: 93, vitaminD: 0, vitaminE: 1.5, vitaminK: 40.3, b1: 0.03, b2: 0.03, b3: 0.3, b5: 0.2, b6: 0.06, b7: 0.1, b12: 0, folate: 25, iron: 0.3, calcium: 34, iodine: 1, magnesium: 17, zinc: 0.1, potassium: 312, selenium: 0.2, copper: 0.13, manganese: 0.1, defaultAmount: 70 },
];