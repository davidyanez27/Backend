import { Prisma } from "@prisma/client";
import { Company } from "@inventory/shared-types";

const withMembers = Prisma.validator<Prisma.CompanyDefaultArgs>()({
  include: {
    subscription: { include: { plan: true } },
    members: {
      include: {
        user: { select: { uuid: true, fullName: true, email: true } },
        role: { select: { uuid: true, name: true } }
      }
    }
  }
});
export type CompanyWithMembers = Prisma.CompanyGetPayload<typeof withMembers>;

export const CompanyQueryMapper = {
  toDto(row: CompanyWithMembers): Company {
    const { uuid, name, companyType, idType, idValue, address, country, phone, email, isActive, currency, logo } = row;

    return {
      id: uuid,
      name,
      companyType,
      idType,
      idValue,
      address,
      country,
      phone,
      email,
      logo: logo ?? null,
      isActive,
      currency,
    };
  },
};
