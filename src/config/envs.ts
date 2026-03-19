import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  //Node
  PORT: get('PORT').required().asPortNumber(),
  
  //Database
  POSTGRES_URL: get('POSTGRES_URL').required().asString(),
  POSTGRES_USER: get('POSTGRES_USER').required().asString(),
  POSTGRES_DB: get('POSTGRES_DB').required().asString(),
  POSTGRES_PORT: get('POSTGRES_PORT').required().asPortNumber(),
  POSTGRES_PASSWORD: get('POSTGRES_PASSWORD').required().asString(),

  //Auth
  JWT_SEED: get('JWT_SEED').required().asString(),

  //Email Service
  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),

  //Cors
  WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),
  
  //Google OAuth2
  CLIENT_ID: get('CLIENT_ID').required().asString(),
  CLIENT_SECRET: get('CLIENT_SECRET').required().asString(),
  REDIRECT_URL: get('REDIRECT_URL').required().asUrlString(),

  //Misellaneous
  NODE_ENV: get('NODE_ENV').default('development').asString(),
  // API_URL: get('API_URL').required().asString(),

  // Admin emails (comma-separated list of emails that should be assigned ADMIN role)
  ADMIN_EMAILS: get('ADMIN_EMAILS').default('').asArray(','),

}