// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Date Range Interface
export interface IDateRange {
  startDate: Date;
  endDate: Date;
}

// Search/Filter Interface
export interface ISearchFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';
  value: any;
}

// Sort Interface
export interface ISort {
  field: string;
  direction: 'asc' | 'desc';
}

// Base Entity Fields
export interface IBaseEntity {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

// Soft Delete Entity
export interface ISoftDeleteEntity extends IBaseEntity {
  deletedAt?: Date;
  isActive: boolean;
}

// User Ownership Entity
export interface IUserOwnedEntity extends IBaseEntity {
  userId: number;
}

// Full Featured Entity (Base + Soft Delete + User Ownership)
export interface IFullEntity extends ISoftDeleteEntity, IUserOwnedEntity {}

// Generic ID Types
export type EntityId = number;
export type UUIDString = string;

// Environment Types
export type Environment = 'development' | 'production' | 'test' | 'staging';