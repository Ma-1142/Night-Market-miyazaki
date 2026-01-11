// Booth type pricing in JPY
export const BOOTH_PRICING: Record<string, Record<string, number>> = {
  tent: {
    "1month": 130000,
    "6months": 660000,
    "1year": 1200000,
  },
  yatai: {
    "1year": 1680000, // yatai only has 1-year plan
  },
  kitchencarA: {
    "1month": 130000,
    "6months": 660000,
    "1year": 1200000,
  },
  kitchencarB: {
    "1month": 140000,
    "6months": 708000,
    "1year": 1260000,
  },
};

export const BOOTH_TYPE_LABELS: Record<string, string> = {
  tent: "テント出店",
  yatai: "屋台出店",
  kitchencarA: "キッチンカーA（軽自動車）",
  kitchencarB: "キッチンカーB（大型）",
};

export const PLAN_LABELS: Record<string, string> = {
  "1month": "1ヶ月",
  "6months": "6ヶ月",
  "1year": "1年間",
};

export function getPrice(boothType: string, plan: string): number | null {
  return BOOTH_PRICING[boothType]?.[plan] ?? null;
}

export function isValidCombination(boothType: string, plan: string): boolean {
  return getPrice(boothType, plan) !== null;
}

export function formatPrice(amount: number): string {
  return `¥${amount.toLocaleString()}`;
}
