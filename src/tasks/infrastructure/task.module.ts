import { Module } from "@nestjs/common";
import { McpModule } from "@nestjs-mcp/server";
import { RunrunitModule } from "./external/runrunit/runrunit.module";
import { TaskCommands } from "./task.commands";
import { SqliteService } from "../../shared/infrastructure/database/sqlite/database.service";
import { UserSqliteRepository } from "../../users/infrastructure/database/sqlite/repositories/user-sqlite.repository";
import { StartWork } from "../application/usecases/start-work.usecase";
import { UserRepository } from "../../users/domain/repositories/user.repository";
import { IRunrunitRepository } from "./external/runrunit/repositories/i-runrunit-repository";
import { RunrunitService } from "./external/runrunit/runrunit.service";
import { EndWork } from "../application/usecases/end-work.usecase";
import { TaskTools } from "./task.tools";

@Module({
    imports: [RunrunitModule, McpModule.forFeature()],
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
            provide: StartWork.Usecase,
            useFactory: (
                useRepository: UserRepository.Repository,
                runrunitRepo: IRunrunitRepository,
            ) => new StartWork.Usecase(useRepository, runrunitRepo),
            inject: ["UserRepository", RunrunitService]
        },
        {
            provide: EndWork.Usecase,
            useFactory: (
                useRepository: UserRepository.Repository,
                runrunitRepo: IRunrunitRepository,
            ) => new EndWork.Usecase(useRepository, runrunitRepo),
            inject: ["UserRepository", RunrunitService]
        },
        TaskCommands,
        {
            provide: TaskTools,
            useFactory: (runrunitRepo: IRunrunitRepository) => new TaskTools(runrunitRepo), 
            inject: [RunrunitService]
        }
    ]
})
export class TaskModule { };