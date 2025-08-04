import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Database } from "sqlite";
import * as sqlite3 from "sqlite3";
import { SqliteService } from "./sqlite/database.service";
import { EnvConfigModule } from "../env-config/env-config.module";

@Global()
@Module({
    imports: [EnvConfigModule.forRoot()],
    providers: [SqliteService, ConfigService],
    exports: [SqliteService]
})
export class DatabaseModule {
    static forTest(testDb: Database<sqlite3.Database, sqlite3.Statement>): DynamicModule {
        return {
            module: DatabaseModule,
            providers: [
                {
                    provide: SqliteService,
                    useFactory: () => ({
                        connection: testDb,
                    }),
                },
            ],
            exports: [SqliteService],
        };
    }
}
