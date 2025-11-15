// modules/blog/blog.interface.ts
export interface IBlog {
  id?: string;
  title: string;
  slug: string;
  description?: string | null;
  content?: string | null;
  category?: string | null;
  tags?: string[] | null;
  featuredImage?: string | null;
  authorId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBlogFilters {
  searchTerm?: string;
  category?: string;
  tag?: string;
}

export interface IOptions {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc" | string;
}
export interface IBlogPaginationResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: IBlog[];
}
