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
let routes;
try {
  routes = AppRoutes.routes;
  console.log('✅ Routes loaded successfully');
} catch (error) {
  console.error('❌ Routes failed to load:', error);
}

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}