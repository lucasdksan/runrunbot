import { Module } from "@nestjs/common";
import { UserCommands } from "./user.commands";
import { SqliteService } from "../../shared/infrastructure/database/sqlite/database.service";
import { UserSqliteRepository } from "./database/sqlite/repositories/user-sqlite.repository";
import { CreateUser } from "../application/usecases/create-user.usecase";
import { UserRepository } from "../domain/repositories/user.repository";
import { AnalyzePerformance } from "../application/usecases/analyze-performance.usecase";
import { RunrunitService } from "../../shared/infrastructure/runrunit/runrunit.service";
import { IRunrunitRepository } from "../../shared/infrastructure/runrunit/repositories/i-runrunit-repository";
import { UserSchedules } from "./user.schedules";
import { RunrunitModule } from "../../shared/infrastructure/runrunit/runrunit.module";

@Module({
    imports: [RunrunitModule],
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
        {
            provide: AnalyzePerformance.Usecase,
            useFactory: (
                useRepository: UserRepository.Repository,
                runrunitRepo: IRunrunitRepository,
            ) => new AnalyzePerformance.Usecase(useRepository, runrunitRepo),
            inject: ["UserRepository", RunrunitService]
        },
        UserCommands,
        UserSchedules
    ],
    exports: [],
})
export class UserModule {};