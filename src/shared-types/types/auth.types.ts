export type AuthClaims = {
  sub: string;        
  rid: string;        
  org?: string;       
  ver?: number;       
};

export type AuthIdentity = {
  userId: number;
  userUuid: string;
  fullName: string;
  appRole: string;
  companyId: number;
  companyUuid: string;
  companyName: string;
  companyRole: string;
}