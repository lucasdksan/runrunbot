import { Module } from "@nestjs/common";
import { UserCommands } from "./user.commands";
import { SqliteService } from "../../shared/infrastructure/database/sqlite/database.service";
import { UserSqliteRepository } from "./database/sqlite/repositories/user-sqlite.repository";
import { CreateUser } from "../application/usecases/create-user.usecase";
import { UserRepository } from "../domain/repositories/user.repository";

@Module({
    imports: [],
    controllers: [],
    providers: [
        {
            provide: "SqliteService",
            useClass: SqliteService,
        },
        {
            provide: "UserRepository",
            useFactory: (sqliteService: SqliteService) => new UserSqliteRepository(sqliteService),
            inject: ["SqliteService"] 
        },
        {
            provide: CreateUser.Usecase,
            useFactory: (
                useRepository: UserRepository.Repository,
            ) => new CreateUser.Usecase(useRepository),
            inject: ["UserRepository"]
        },
        UserCommands
    ],
    exports: [],
})
export class UserModule {};