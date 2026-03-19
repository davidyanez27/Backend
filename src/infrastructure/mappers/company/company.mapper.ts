import type { Company as PrismaCompany } from "@prisma/client";
import { CompanyEntity } from '../../../domain/entities';
import { Company, Prisma } from "@prisma/client";
import { CompanyType } from "../../../domain/types";

type PrismaCompanyCreate = Omit<PrismaCompany, "id" | "createdAt" | "updatedAt">;


export const CompanyCommandMapper = {
  fromPrisma(row: Company): CompanyEntity {
    const { uuid, name, companyType, idType, idValue, address, country, phone, email, isActive, currency, logo, stripeCustomerId } = row;

    return CompanyEntity.fromSnapshot({
      id: uuid,
      name,
      companyType: companyType as CompanyType,
      idType,
      idValue,
      address,
      country,
      phone,
      email,
      isActive,
      currency,
      logo,
      stripeCustomerId,
    });
  },

  toPrismaCreate(companyEntity: CompanyEntity): PrismaCompanyCreate {
    const company = companyEntity.snapshot;
    const { id, name, companyType, idType, idValue, address, country, phone, email, isActive, currency, logo, stripeCustomerId } = company;
    return {
      uuid: id,
      name,
      companyType: companyType as PrismaCompany['companyType'],
      idType,
      idValue,
      address,
      country,
      phone,
      email,
      isActive,
      currency,
      logo: logo ?? null,
      stripeCustomerId: stripeCustomerId ?? null,
    };
  },
};
