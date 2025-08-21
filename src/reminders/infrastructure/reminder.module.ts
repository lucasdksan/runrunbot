import { Module } from "@nestjs/common";
import { SqliteService } from "../../shared/infrastructure/database/sqlite/database.service";
import { UserSqliteRepository } from "../../users/infrastructure/database/sqlite/repositories/user-sqlite.repository";
import { ReminderSqliteRepository } from "./database/sqlite/repositories/reminder-sqlite.repository";
import { CreateReminder } from "../application/usecases/create-reminder.usecase";
import { UserRepository } from "../../users/domain/repositories/user.repository";
import { ReminderRepository } from "../domain/repositories/reminder.repository";
import { ReminderCommands } from "./reminder.commands";
import { ListReminder } from "../application/usecases/list-reminder.usecase";
import { GetAllReminder } from "../application/usecases/get-all-reminder.usecase";
import { EnvConfigModule } from "../../shared/infrastructure/env-config/env-config.module";
import { ReminderSchedules } from "./reminder.schedules";
import { GetUserReminder } from "../application/usecases/get-user-reminder.usecase";
import { SendMessageReminder } from "../application/usecases/send-message-reminder.usecase";

@Module({
    imports: [EnvConfigModule],
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
            provide: "ReminderRepository",
            useFactory: (sqliteService: SqliteService) => new ReminderSqliteRepository(sqliteService),
            inject: ["SqliteService"]
        },
        {
            provide: CreateReminder.Usecase,
            useFactory: (
                useRepository: UserRepository.Repository,
                reminderRepository: ReminderRepository.Repository,
            ) => new CreateReminder.Usecase(useRepository, reminderRepository),
            inject: ["UserRepository", "ReminderRepository"]
        },
        {
            provide: ListReminder.Usecase,
            useFactory: (
                useRepository: UserRepository.Repository,
                reminderRepository: ReminderRepository.Repository,
            ) => new ListReminder.Usecase(useRepository, reminderRepository),
            inject: ["UserRepository", "ReminderRepository"]
        },
        {
            provide: GetAllReminder.Usecase,
            useFactory: (
                reminderRepository: ReminderRepository.Repository,
            ) => new GetAllReminder.Usecase(reminderRepository),
            inject: ["ReminderRepository"]
        },
        {
            provide: GetUserReminder.Usecase,
            useFactory: (
                useRepository: UserRepository.Repository,
            ) => new GetUserReminder.Usecase(useRepository),
            inject: ["UserRepository"]
        },
        {
            provide: SendMessageReminder.Usecase,
            useFactory: (
                useRepository: UserRepository.Repository,
            ) => new SendMessageReminder.Usecase(useRepository),
            inject: ["UserRepository"]
        },
        ReminderCommands,
        ReminderSchedules
    ],
    exports: [],
})
export class ReminderModule { };