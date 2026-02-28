export interface Nutrient {
  name: string;
  value: number;
  unit: string;
}

export const RDI_DATA = {
  male: {
    label: "Man (18-60 år)",
    nutrients: {
      calories: { name: "Kalorier", value: 2500, unit: "kcal" },
      protein: { name: "Protein", value: 75, unit: "g" },
      fiber: { name: "Fibrer", value: 35, unit: "g" },
      omega3: { name: "Omega-3", value: 2.5, unit: "g" },
      // Vitaminer
      vitaminA: { name: "Vitamin A", value: 900, unit: "µg" },
      vitaminC: { name: "Vitamin C", value: 75, unit: "mg" },
      vitaminD: { name: "Vitamin D", value: 10, unit: "µg" },
      vitaminE: { name: "Vitamin E", value: 10, unit: "mg" },
      vitaminK: { name: "Vitamin K", value: 80, unit: "µg" },
      b1: { name: "Tiamin (B1)", value: 1.4, unit: "mg" },
      b2: { name: "Riboflavin (B2)", value: 1.6, unit: "mg" },
      b3: { name: "Niacin (B3)", value: 18, unit: "mg" },
      b5: { name: "Pantotensyra (B5)", value: 5, unit: "mg" },
      b6: { name: "Vitamin B6", value: 1.6, unit: "mg" },
      b7: { name: "Biotin (B7)", value: 30, unit: "µg" },
      b12: { name: "Vitamin B12", value: 2.0, unit: "µg" },
      folate: { name: "Folat (B9)", value: 300, unit: "µg" },
      // Mineraler
      iron: { name: "Järn", value: 9, unit: "mg" },
      calcium: { name: "Kalcium", value: 800, unit: "mg" },
      iodine: { name: "Jod", value: 150, unit: "µg" },
      magnesium: { name: "Magnesium", value: 350, unit: "mg" },
      zinc: { name: "Zink", value: 9, unit: "mg" },
      potassium: { name: "Kalium", value: 3500, unit: "mg" },
      selenium: { name: "Selen", value: 60, unit: "µg" },
      copper: { name: "Koppar", value: 0.9, unit: "mg" },
      manganese: { name: "Mangan", value: 2.3, unit: "mg" }
    }
  },
  female: {
    label: "Kvinna (18-60 år)",
    nutrients: {
      calories: { name: "Kalorier", value: 2000, unit: "kcal" },
      protein: { name: "Protein", value: 60, unit: "g" },
      fiber: { name: "Fibrer", value: 25, unit: "g" },
      fat: { name: "Fett", value: 70, unit: "g" },
      omega3: { name: "Omega-3", value: 2.0, unit: "g" },
      vitaminA: { name: "Vitamin A", value: 700, unit: "µg" },
      vitaminC: { name: "Vitamin C", value: 75, unit: "mg" },
      vitaminD: { name: "Vitamin D", value: 10, unit: "µg" },
      vitaminE: { name: "Vitamin E", value: 8, unit: "mg" },
      vitaminK: { name: "Vitamin K", value: 70, unit: "µg" },
      b1: { name: "Tiamin (B1)", value: 1.1, unit: "mg" },
      b2: { name: "Riboflavin (B2)", value: 1.3, unit: "mg" },
      b3: { name: "Niacin (B3)", value: 15, unit: "mg" },
      b5: { name: "Pantotensyra (B5)", value: 5, unit: "mg" },
      b6: { name: "Vitamin B6", value: 1.3, unit: "mg" },
      b7: { name: "Biotin (B7)", value: 30, unit: "µg" },
      b12: { name: "Vitamin B12", value: 2.0, unit: "µg" },
      folate: { name: "Folat (B9)", value: 400, unit: "µg" },
      iron: { name: "Järn", value: 15, unit: "mg" },
      calcium: { name: "Kalcium", value: 800, unit: "mg" },
      iodine: { name: "Jod", value: 150, unit: "µg" },
      magnesium: { name: "Magnesium", value: 280, unit: "mg" },
      zinc: { name: "Zink", value: 7, unit: "mg" },
      potassium: { name: "Kalium", value: 3100, unit: "mg" },
      selenium: { name: "Selen", value: 50, unit: "µg" },
      copper: { name: "Koppar", value: 0.9, unit: "mg" },
      manganese: { name: "Mangan", value: 2.0, unit: "mg" }
    }
  }
};