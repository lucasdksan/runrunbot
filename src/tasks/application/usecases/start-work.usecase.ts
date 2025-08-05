import { BadRequestError } from "../../../shared/application/errors/bad-request-error";
import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { UserRepository } from "../../../users/domain/repositories/user.repository";
import { TaskEntity } from "../../domain/entities/task.entity";
import { IRunrunitRepository } from "../../infrastructure/external/runrunit/repositories/i-runrunit-repository";
import { DefaultOutput, DefaultOutputMapper } from "../dtos/default-output.dto";

export namespace StartWork {
    export type Input = {
        discordUser: string;
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
                message: `Olá ${entity.discordUser}!\nVocê não possui tarefas para produção no momento.`
            };

            const tasksFiltered = TaskEntity.filterTasks(entity.runrunitUser, tasks);
            const message = tasksFiltered.map(task => `* ID: ${task.id}, Título: [${task.title}](https://runrun.it/pt-BR/tasks/${task.id}), Etapa: ${task.board_stage_name}`).join('\n');

            return DefaultOutputMapper.toOutput(message);
        }
    }
};