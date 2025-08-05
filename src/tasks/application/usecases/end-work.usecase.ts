import { BadRequestError } from "../../../shared/application/errors/bad-request-error";
import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { UserRepository } from "../../../users/domain/repositories/user.repository";
import { TaskEntity } from "../../domain/entities/task.entity";
import { PauseTaskDto } from "../../infrastructure/external/runrunit/dtos/pause-task.dto";
import { IRunrunitRepository } from "../../infrastructure/external/runrunit/repositories/i-runrunit-repository";
import { DefaultOutput, DefaultOutputMapper } from "../dtos/default-output.dto";

export namespace EndWork {
    export type Input = {
        discordUser: string;
        userInput: string;
    };

    export type Output = DefaultOutput;

    export class Usecase implements DefaultUseCase<Input, Output> {
        constructor(
            private userRepository: UserRepository.Repository,
            private runrunitRepo: IRunrunitRepository,
        ) { }

        async execute(input: Input): Promise<Output> {
            const { discordUser } = input;

            if (!discordUser) throw new BadRequestError("Input data not provided");

            const entity = await this.userRepository.findByDiscordUser(discordUser);
            const tasks = await this.runrunitRepo.getAllTasks();

            if (tasks.length === 0) return {
                message: `Olá ${entity.discordUser}!\nVocê não possui tarefas na etapa de ongoing.\nBoa noite!`
            };

            const tasksFiltered = TaskEntity.taskOngoing(entity.runrunitUser, tasks);

            await Promise.all(
                tasksFiltered.map((task) => {
                    const dto = new PauseTaskDto();
                    dto.id = task.id;

                    return this.runrunitRepo.pauseTask(dto);
                })
            );

            return DefaultOutputMapper.toOutput(`Pausei todas suas tarefa.\n${input.userInput.toLowerCase() === "encerrando" ? "Boa noite!" : "Bom almoço!"}`);
        }
    }
};