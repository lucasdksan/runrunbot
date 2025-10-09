import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { IIARepository } from "../../../shared/infrastructure/ia/repositories/i-ia-repository";
import { IRunrunitRepository } from "../../../shared/infrastructure/runrunit/repositories/i-runrunit-repository";
import { TaskEntity } from "../../../tasks/domain/entities/task.entity";
import { UserRepository } from "../../domain/repositories/user.repository";

export namespace AnalyzePerformance {
    export type Input = void;

    export type Output = {};

    export class Usecase implements DefaultUseCase<Input, Output> {
        constructor(
            private userRepository: UserRepository.Repository,
            private runrunitRepo: IRunrunitRepository,
            private iaRepo: IIARepository,
        ) { }
        
        async execute(_: Input): Promise<Output> {
            const list = await this.userRepository.findAll();
            const taskList = await this.runrunitRepo.getAllTasks();
            const taskListFiltered = TaskEntity.separationResponsibleId(taskList);

            for(const user of list) {
                let { runrunitUser } = user.toJSON();

                console.log("Data: ", taskListFiltered[runrunitUser])
            }

            // console.log("List: ", list);
            // console.log("TaskList: ", taskListFiltered);

            return {};
        }
    }
}