export interface Dictionary<T> {
  [Key: string]: T;
}

export default interface TypeWatch {
  id: string;
  brand: string;
  model: string;
  article: string;
  price: number;
  type: string;
  year: string;
  case: string;
  bracelet: string;
  clockwork: string;
  dial: string;
  glass: string;
  diameter: string;
  features: string[];
  images: string[];
  count: number;
}

export interface PurchaseType {
  watches: TypeWatch[];
  email: string;
  time: number;
  id: number;
}

export interface User {
  email: string;
  password: string;
  id: number;
  role: string;
}

export interface AuthUser {
  email: string,
  auth: boolean
}

export interface DateTimeFormatOptions {
  localeMatcher?: "best fit" | "lookup";
  weekday?: "long" | "short" | "narrow";
  era?: "long" | "short" | "narrow";
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day?: "numeric" | "2-digit";
  hour?: "numeric" | "2-digit";
  minute?: "numeric" | "2-digit";
  second?: "numeric" | "2-digit";
  timeZoneName?: "long" | "short";
  formatMatcher?: "best fit" | "basic";
  hour12?: boolean;
  timeZone?: string;
}