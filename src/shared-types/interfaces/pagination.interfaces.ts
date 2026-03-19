export interface BasePagination {
  page: number;
  limit: number;
  total: number;
  next: string | null;
  prev: string | null;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
