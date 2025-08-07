import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { PlayTaskDto } from "../../infrastructure/external/runrunit/dtos/play-task.dto";
import { IRunrunitRepository } from "../../infrastructure/external/runrunit/repositories/i-runrunit-repository";

export namespace PlayTask {
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
            const dto = new PlayTaskDto();

            dto.id = id;

            await this.runrunitRepo.playTask(dto);
        }
    }
}