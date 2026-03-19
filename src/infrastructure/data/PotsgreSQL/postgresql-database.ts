import { PrismaClient } from "@prisma/client";


interface Options {
    postgrestUrl: string;
    dbName      : string;
}

export class PostgresDatabase{
    private static client: PrismaClient;
    
    static async connect( options: Options ){
        const { postgrestUrl, dbName } = options;

        this.client = new PrismaClient({
            datasources:{
                db: { url: postgrestUrl }
            },
        });
        await this.client.$connect();
        console.log('Connected to Postgres Database');
        return this.client;
    }

    static async disconnect(): Promise<void> {
        if (this.client) {
          await this.client.$disconnect();
          console.log('Disconnected from Postgres');
        }
      }
      static get clientInstance(): PrismaClient {
        if (!this.client) {
          throw new Error('PrismaClient not initialized. Call PostgresDatabase.connect() first.');
        }
        return this.client;
      }


}