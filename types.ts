export enum AccountStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD'
}

export enum AccountCategory {
  BUDGET = 'BUDGET',
  RARE = 'RARE',
  PREMIUM = 'PREMIUM'
}

export interface Account {
  id: string;
  title: string;
  description: string;
  price: number;
  level: number;
  rankBr: string;
  rankCs: string;
  server: string;
  skinsCount: number;
  evoGunsCount: number;
  elitePassCount: number;
  loginMethod: string; // e.g., Facebook, VK, Google
  status: AccountStatus;
  category: AccountCategory;
  tags: string[]; // e.g., ["OG", "S1", "Criminal"]
  images: string[];
  thumbnail: string;
  featured: boolean;
  createdAt: number;
  videoUrl?: string; // Optional YouTube/Drive link
}

// For form inputs
export type AccountFormData = Omit<Account, 'id' | 'createdAt'>;

export interface FilterState {
  category: AccountCategory | 'ALL';
  minPrice: number;
  maxPrice: number;
  search: string;
}
