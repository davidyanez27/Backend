import { envs } from './config';
import { PostgresDatabase } from './infrastructure/data/PotsgreSQL/postgresql-database';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';


(async()=> {
  main();
})();


async function main() {

  await PostgresDatabase.connect({
    postgrestUrl: envs.POSTGRES_URL,
    dbName: envs.POSTGRES_DB
  })

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}