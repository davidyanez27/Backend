import { BasePagination } from "./pagination.interfaces";


export interface Product {
  readonly name: string,
  readonly defaultPrice: number ,  
  readonly userId: number,
  readonly description: string,
  readonly unit: string ,          
  readonly uuid?: string,
  readonly createdAt?: Date,               
  readonly updatedAt?: Date,
  readonly isActive?: boolean   

}

export interface CreateProductRequestPayload {
  name: string;
  description: string;
  defaultPrice: number;
  unit: string;
  IsActive?: boolean;
}

export interface UpdateProductRequestPayload {
  uuid: string;
  name?: string;
  description?: string;
  defaultPrice?: number;
  unit?: string;
  IsActive?: boolean;
}

export interface ListProductsResponse extends BasePagination {
  products: Product[];
}
