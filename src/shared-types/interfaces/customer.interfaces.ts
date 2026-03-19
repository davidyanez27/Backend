import { BasePagination } from "./pagination.interfaces";


export interface Customer {
  readonly firstName: string,
  readonly LastName: string,
  readonly email: string ,  
  readonly phone: string,
  readonly billing_address?: string,
  readonly shipping_address?: string, 
  readonly notes?: string,
  readonly uuid?: string,
  readonly createdAt?: Date,               
  readonly updatedAt?: Date,
  readonly isActive?: boolean   

}

export interface CreateCustomerRequestPayload {
  firstName: string;
  LastName: string;
  email: string;
  phone: string;
  billing_address?: string;
  shipping_address?: string;
  notes?: string;
}

export interface UpdateCustomerRequestPayload {
  uuid: string;
  firstName?: string;
  LastName?: string;
  email?: string;
  phone?: string;
  billing_address?: string;
  shipping_address?: string;
  notes?: string;
  IsActive?: boolean;
}

export interface ListCustomerResponse extends BasePagination {
  products: Customer[];
}
