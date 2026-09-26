export type SigningAuthorType = "Novus AI" | "Marcio" | "Guest";

export interface Author {
  name: string;
  role: SigningAuthorType;
  avatar: string;
  title: string;
  bio: string;
}

export type ArticleCategory =
  | "Geopolitics"
  | "Economics"
  | "Tech-AI"
  | "Green-Tech"
  | "CSR"
  | "Brazil";

export type Category = ArticleCategory;

export interface Article {
  id: number;
  category: ArticleCategory;
  title: string;
  excerpt: string;
  content: string;
  wordCount: number;
  imageUrl: string;
  date: string;
  readTime: number;
  tags: string[];
  author: Author;
  featured?: boolean;
}

export interface Solution {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  videoUrl?: string; // local public video pathway
  highlights: string[];
  specs: Record<string, string>;
}
