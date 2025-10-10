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
import { IAModule } from "../../shared/infrastructure/ia/ia.module";
import { IIARepository } from "../../shared/infrastructure/ia/repositories/i-ia-repository";
import { IAService } from "../../shared/infrastructure/ia/ia.service";
import { DiscordModule } from "../../shared/infrastructure/discord/discord.module";
import { DiscordService } from "../../shared/infrastructure/discord/discord.service";

@Module({
    imports: [RunrunitModule, IAModule, DiscordModule],
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
                iaRepo: IIARepository,
                discordService: DiscordService,
            ) => new AnalyzePerformance.Usecase(useRepository, runrunitRepo, iaRepo, discordService),
            inject: ["UserRepository", RunrunitService, IAService, DiscordService]
        },
        UserCommands,
        UserSchedules
    ],
    exports: [],
})
export class UserModule {};