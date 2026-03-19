import { CustomError } from "../../application/errors";
import { UuidV4, Money, CompanyId, UserId, ItemType, Unit } from "../value-objects";
import { UUID } from '../../config';
import { ProductProps } from "../types";

const error = "Product Id is required"

export class ProductEntity {
  private constructor(
    public readonly id: UuidV4,
    private props: ProductProps,
  ) {
    this.ensureInvariants();
  }

  static createNew(props: Omit<ProductProps, "isActive"> & { isActive?: boolean }) {
    const id = UuidV4.from(UUID.generate());
    return new ProductEntity(id, { isActive: true, ...props });
  }

  static fromSnapshot(snapshot: { id: string; companyId: number; type: string; unit: string; createdById?: number | null; updatedById?: number | null } & Omit<ProductProps, "companyId" | "type" | "unit" | "createdById" | "updatedById">) {
    return new ProductEntity(UuidV4.from(snapshot.id), {
      ...snapshot,
      companyId: new CompanyId(snapshot.companyId),
      type: ItemType.from(snapshot.type),
      unit: Unit.from(snapshot.unit),
      createdById: snapshot.createdById ? new UserId(snapshot.createdById) : null,
      updatedById: snapshot.updatedById ? new UserId(snapshot.updatedById) : null,
    });
  }

  rename(name: string) {
    if (!name?.trim()) throw CustomError.badRequest("Name is required");
    this.props.name = name.trim();
  }

  changeDescription(description: string) {
    if (!description?.trim()) throw CustomError.badRequest("Description is required");
    this.props.description = description.trim();
  }

  changePrice(newPrice: Money) {
    this.props.defaultPrice = newPrice;
  }

  changeType(type: ItemType) {
    this.props.type = type;
  }

  changeUnit(unit: Unit) {
    this.props.unit = unit;
  }

  deactivate() { this.props.isActive = false; }
  activate() { this.props.isActive = true; }

  setUpdatedBy(userId: UserId) { this.props.updatedById = userId; }

  get snapshot() {
    return {
      id: this.id.value,
      name: this.props.name,
      description: this.props.description,
      defaultPrice: this.props.defaultPrice,
      unit: this.props.unit.value,
      type: this.props.type.value,
      isActive: this.props.isActive,
      companyId: this.props.companyId.getValue(),
      createdById: this.props.createdById?.getValue() ?? null,
      updatedById: this.props.updatedById?.getValue() ?? null,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  private ensureInvariants() {
    if (!this.props.name?.trim()) throw CustomError.badRequest("Name is required");
    if (!this.props.description?.trim()) throw CustomError.badRequest("Description is required");
    if (!this.props.unit) throw CustomError.badRequest("Unit is required");
    if (!this.props.companyId) throw CustomError.badRequest("Company Id is required");
  }
}
