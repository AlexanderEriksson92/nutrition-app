export interface Nutrient {
  value: number;
  unit: string;
  name: string;
}

export interface ProfileData {
  label: string;
  nutrients: {
    [key: string]: Nutrient;
  };
}

export const RDI_DATA: { [key: string]: ProfileData } = {
  male: {
    label: "Man (18-60 år)",
    nutrients: {
      protein: { value: 75, unit: "g", name: "Protein" },
      fiber: { value: 35, unit: "g", name: "Kostfiber" },
      vitaminD: { value: 10, unit: "µg", name: "Vitamin D" },
      vitaminC: { value: 75, unit: "mg", name: "Vitamin C" },
      iron: { value: 9, unit: "mg", name: "Järn" },
      magnesium: { value: 350, unit: "mg", name: "Magnesium" },
      zinc: { value: 9, unit: "mg", name: "Zink" },
      folate: { value: 300, unit: "µg", name: "Folat" }
    }
  },
  female: {
    label: "Kvinna (18-60 år)",
    nutrients: {
      protein: { value: 65, unit: "g", name: "Protein" },
      fiber: { value: 25, unit: "g", name: "Kostfiber" },
      vitaminD: { value: 10, unit: "µg", name: "Vitamin D" },
      vitaminC: { value: 75, unit: "mg", name: "Vitamin C" },
      iron: { value: 15, unit: "mg", name: "Järn" },
      magnesium: { value: 280, unit: "mg", name: "Magnesium" },
      zinc: { value: 7, unit: "mg", name: "Zink" },
      folate: { value: 400, unit: "µg", name: "Folat" }
    }
  }
};