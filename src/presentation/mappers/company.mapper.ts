import { CompanyEntity } from '../../domain/entities';
import { Company, CreateCompanyDto, DefaultRegisterDto } from "@inventory/shared-types";
import { CompanyIdentification } from '../../domain/value-objects';

export const DtoCompanyMapper = {

  FromDto(dto: CreateCompanyDto): CompanyEntity {
    const { name, country, address, phone, email, idType, idValue, currency, companyType } = dto;
    return CompanyEntity.createNew({
      name,
      country,
      currency,
      email,
      address,
      phone,
      identification: idType && idValue ? CompanyIdentification.create(idType, idValue) : CompanyIdentification.pending(),
      companyType,
    });
  },

  FromRegisterDto(dto: DefaultRegisterDto): CompanyEntity {
    const { companyName, email, country, currency } = dto;
    return CompanyEntity.createNew({
      name: companyName,
      email,
      country,
      currency,
    });
  },

  ToDto(companyEntity: CompanyEntity): Company {
    const { id, name, country, address, phone, email, idType, idValue, currency, companyType, logo, isActive } = companyEntity.snapshot;
    return {
      id,
      name,
      country,
      address,
      phone,
      email,
      idType,
      idValue,
      currency,
      companyType,
      logo: logo ?? null,
      isActive,
    };
  }
};
