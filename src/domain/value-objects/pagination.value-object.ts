export class Pagination {
  private constructor(
    public readonly page: number,
    public readonly limit: number,
  ) {}

  static create(page = 1, limit = 10): Pagination {
    if (!Number.isFinite(page) || page < 1) throw new Error('Page must be >= 1');
    if (!Number.isFinite(limit) || limit < 1) throw new Error('Limit must be >= 1');
    return new Pagination(page, limit);
  }
}

export class Page<T> {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly total: number,
    public readonly next: string | null,
    public readonly prev: string | null,
    public readonly items: T[],
  ) {}
}
