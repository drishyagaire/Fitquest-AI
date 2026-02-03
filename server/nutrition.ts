type MacroTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

type FoodLibraryItem = {
  name: string;
  keywords: string[];
  mode: "per100g" | "perUnit";
  macros: MacroTotals;
  defaultQuantity: number;
};

const FOOD_LIBRARY: FoodLibraryItem[] = [
  {
    name: "Chicken breast",
    keywords: ["chicken breast", "chicken"],
    mode: "per100g",
    macros: { calories: 165, protein: 31, carbs: 0, fats: 3.6 },
    defaultQuantity: 150,
  },
  {
    name: "Salmon",
    keywords: ["salmon"],
    mode: "per100g",
    macros: { calories: 208, protein: 20, carbs: 0, fats: 13 },
    defaultQuantity: 150,
  },
  {
    name: "Cooked rice",
    keywords: ["rice"],
    mode: "per100g",
    macros: { calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
    defaultQuantity: 150,
  },
  {
    name: "Oats",
    keywords: ["oats", "oatmeal"],
    mode: "per100g",
    macros: { calories: 389, protein: 17, carbs: 66, fats: 7 },
    defaultQuantity: 40,
  },
  {
    name: "Greek yogurt",
    keywords: ["greek yogurt", "yogurt"],
    mode: "per100g",
    macros: { calories: 59, protein: 10, carbs: 3.6, fats: 0.4 },
    defaultQuantity: 170,
  },
  {
    name: "Egg",
    keywords: ["egg", "eggs"],
    mode: "perUnit",
    macros: { calories: 72, protein: 6.3, carbs: 0.4, fats: 5 },
    defaultQuantity: 2,
  },
  {
    name: "Banana",
    keywords: ["banana", "bananas"],
    mode: "perUnit",
    macros: { calories: 105, protein: 1.3, carbs: 27, fats: 0.4 },
    defaultQuantity: 1,
  },
  {
    name: "Apple",
    keywords: ["apple", "apples"],
    mode: "perUnit",
    macros: { calories: 95, protein: 0.5, carbs: 25, fats: 0.3 },
    defaultQuantity: 1,
  },
  {
    name: "Milk",
    keywords: ["milk"],
    mode: "perUnit",
    macros: { calories: 103, protein: 8, carbs: 12, fats: 2.4 },
    defaultQuantity: 1,
  },
  {
    name: "Bread slice",
    keywords: ["bread", "toast", "slice"],
    mode: "perUnit",
    macros: { calories: 80, protein: 3, carbs: 15, fats: 1 },
    defaultQuantity: 2,
  },
  {
    name: "Peanut butter",
    keywords: ["peanut butter", "pb"],
    mode: "perUnit",
    macros: { calories: 94, protein: 3.5, carbs: 3.2, fats: 8 },
    defaultQuantity: 1,
  },
  {
    name: "Olive oil",
    keywords: ["olive oil"],
    mode: "perUnit",
    macros: { calories: 119, protein: 0, carbs: 0, fats: 13.5 },
    defaultQuantity: 1,
  },
];

const clampNumber = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0);

const roundMacro = (value: number) => Math.round(clampNumber(value));

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findQuantity = (description: string, keyword: string, mode: FoodLibraryItem["mode"]) => {
  const safeKeyword = escapeRegExp(keyword);

  if (mode === "per100g") {
    const gramPatterns = [
      new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(?:g|grams|gram)\\s*(?:of\\s*)?${safeKeyword}`),
      new RegExp(`${safeKeyword}\\s*(\\d+(?:\\.\\d+)?)\\s*(?:g|grams|gram)`),
    ];

    for (const pattern of gramPatterns) {
      const match = description.match(pattern);
      if (match) return Number.parseFloat(match[1]);
    }

    return undefined;
  }

  const unitPatterns = [
    new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(?:x\\s*)?${safeKeyword}`),
    new RegExp(`${safeKeyword}\\s*(\\d+(?:\\.\\d+)?)`),
  ];

  for (const pattern of unitPatterns) {
    const match = description.match(pattern);
    if (match) return Number.parseFloat(match[1]);
  }

  return undefined;
};

export type NutritionEstimate = MacroTotals & {
  name: string;
  matchedItems: string[];
  notes?: string;
};

export function estimateNutrition(description: string): NutritionEstimate {
  const normalized = description.toLowerCase();
  const totals: MacroTotals = { calories: 0, protein: 0, carbs: 0, fats: 0 };
  const matchedItems: string[] = [];

  FOOD_LIBRARY.forEach((item) => {
    const matchedKeyword = item.keywords.find((keyword) => normalized.includes(keyword));
    if (!matchedKeyword) return;

    const quantity = findQuantity(normalized, matchedKeyword, item.mode) ?? item.defaultQuantity;
    const multiplier = item.mode === "per100g" ? quantity / 100 : quantity;

    totals.calories += item.macros.calories * multiplier;
    totals.protein += item.macros.protein * multiplier;
    totals.carbs += item.macros.carbs * multiplier;
    totals.fats += item.macros.fats * multiplier;
    matchedItems.push(item.name);
  });

  if (matchedItems.length === 0) {
    return {
      name: description.trim() || "Custom meal",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      matchedItems,
      notes: "No known foods matched. Try adding quantities like '150g chicken' or '2 eggs'.",
    };
  }

  return {
    name: matchedItems.join(", "),
    calories: roundMacro(totals.calories),
    protein: roundMacro(totals.protein),
    carbs: roundMacro(totals.carbs),
    fats: roundMacro(totals.fats),
    matchedItems,
  };
}