
export interface Project {
  id: number;
  created_at: string;
  slug: string;
  name_th: string;
  name_en: string;
  developer?: string;
  year_built?: number;
  floors?: number;
  units?: number;
  facilities?: string[];
  bts?: string;
  mrt?: string;
  landmark?: string;
  lat?: number;
  lng?: number;
  highlights?: string[];
}

export interface Property {
  id: number;
  created_at: string;
  project_slug: string;
  type: 'rent' | 'buy';
  title_th: string;
  title_en?: string;
  slug_en?: string;
  price: number;
  price_unit?: 'month' | 'sale';
  size_sqm?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  furnished?: string;
  bts_distance_m?: number;
  mrt_distance_m?: number;
  badges?: string[];
  images?: string[];
  status?: string;
  projects?: Project; // This will be populated by a Supabase join
}
