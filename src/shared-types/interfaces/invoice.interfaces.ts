import { BasePagination } from "./pagination.interfaces";


export interface Invoice {
  readonly number: string,
  readonly status: string,
  readonly currency: string ,  
  readonly issueDate: string,
  readonly uuid?: string,
  readonly dueDate?: string,
  readonly subtotal?: number, 
  readonly tax?: number,
  readonly discount?: number,
  readonly total?: number,
  readonly notes?: string,
  readonly createdAt?: Date,               
  readonly updatedAt?: Date,
  readonly isActive?: boolean   
}

export interface CreateInvoiceRequestPayload {
  firstName: string;
  LastName: string;
  email: string;
  phone: string;
  billing_address?: string;
  shipping_address?: string;
  notes?: string;
}

export interface UpdateInvoiceRequestPayload {
  uuid: string;
  firstName?: string;
  LastName?: string;
  email?: number;
  phone?: string;
  billing_address?: string;
  shipping_address?: string;
  notes?: string;
  IsActive?: boolean;
}

