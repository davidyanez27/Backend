import { CustomerId, ProductId, Money } from "../value-objects";

export type CustomerServiceProps = {
  customerId: CustomerId;
  productId: ProductId;
  customPrice: Money;
  notes: string | null;
};
