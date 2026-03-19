import { CompanyId, Money, UserId, ItemType, Unit } from "../value-objects";

export type ProductProps = {
  name: string;
  description: string;
  defaultPrice: Money;
  unit: Unit;
  type: ItemType;
  isActive: boolean;
  companyId: CompanyId;
  createdById?: UserId | null;
  updatedById?: UserId | null;
  createdAt?: Date;
  updatedAt?: Date;
};
