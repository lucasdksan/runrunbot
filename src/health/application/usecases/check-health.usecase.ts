import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { SqliteService } from "../../../shared/infrastructure/database/sqlite/database.service";
import { IDiscordRepository } from "../../../shared/infrastructure/discord/repositories/i-discord-repository";
import { CheckHealthOutput, CheckHealthOutputMapper } from "../dtos/check-health-output.dto";

export namespace CheckHealth {
    export type Input = void;

    export type Output = CheckHealthOutput;

    export class Usecase implements DefaultUseCase<Input, Output> {
        constructor(
            private readonly databaseService: SqliteService,
            private readonly discordService: IDiscordRepository,
        ){}
        
        async execute(_: Input): Promise<Output> {
            const databaseStatus = await this.databaseService.healthCheck();
            const discordStatus = await this.discordService.healthCheck();
            
            return CheckHealthOutputMapper.toOutput({
                databaseStatus,
                discordStatus
            });
        }
    }
}