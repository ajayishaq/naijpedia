export interface SearchResult {
  text: string;
  groundingChunks: GroundingChunk[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface NewsItem {
  title: string;
  summary?: string;
  category: string;
  time: string;
  source?: string;
  url?: string;
}

export interface ArticleSummary {
  points: string[];
  whyItMatters: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface SearchContextType {
  query: string;
  setQuery: (q: string) => void;
  performSearch: (q: string) => void;
  results: SearchResult | null;
  loading: LoadingState;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}