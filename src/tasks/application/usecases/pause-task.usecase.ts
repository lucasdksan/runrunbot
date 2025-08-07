import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { PauseTaskDto } from "../../infrastructure/external/runrunit/dtos/pause-task.dto";
import { IRunrunitRepository } from "../../infrastructure/external/runrunit/repositories/i-runrunit-repository";

export namespace PauseTask {
    export type Input = {
        id: number;
    };

    export type Output = void;

    export class Usecase implements DefaultUseCase<Input, Output> {
        constructor(
            private runrunitRepo: IRunrunitRepository,
        ) { }

        async execute(input: Input): Promise<Output> {
            const { id } = input;
            const dto = new PauseTaskDto();

            dto.id = id;

            await this.runrunitRepo.pauseTask(dto);
        }
    }
}