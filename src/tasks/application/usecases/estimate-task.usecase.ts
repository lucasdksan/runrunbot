import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { EstimateTaskAgentText } from "../../../shared/infrastructure/templates/estimate-task-agent-text";
import { DefaultInputDto } from "../../infrastructure/external/ia/dto/default-input.dto";
import { IIARepository } from "../../infrastructure/external/ia/repositories/i-ia-repository";
import { GetTaskDto } from "../../infrastructure/external/runrunit/dtos/get-task.dto";
import { IRunrunitRepository } from "../../infrastructure/external/runrunit/repositories/i-runrunit-repository";
import { DefaultOutput, DefaultOutputMapper } from "../dtos/default-output.dto";

export namespace EstimateTask {
    export type Input = {
        taskId: number;
    };

    export type Output = DefaultOutput;

    export class Usecase implements DefaultUseCase<Input, Output> {
        constructor(
            private iaRepo: IIARepository,
            private runrunitRepo: IRunrunitRepository,
        ) { }

        async execute(input: Input): Promise<Output> {
            const { taskId } = input;
            const dto = new GetTaskDto();

            dto.id = taskId;

            const entity = await this.runrunitRepo.getTask(dto);
            const message = entity.formatDescription();
            const dtoInput = new DefaultInputDto();

            dtoInput.input = `
                Estime em horas o tempo necessário para fazer a seguinte tarefa.
                ${message}

                **Observação 1:** **NÃO GERE MAIS DE 2000 CARACTERES**.
                **Observação 2:** **TENHA MENOS DE 2000 CARACTERES NA SUA RESPOSTA**.
                **Observação 3:** **LEIA DE FORMA MINUCIOSA OS SEGUINTES COMANDOS** -> ${EstimateTaskAgentText()}
            `;

            let result = await this.iaRepo.generateResult(dtoInput);

            if (result.length > 2000) {
                const retryInput = new DefaultInputDto();
                
                retryInput.input = `
                    O resultado anterior ultrapassou o limite de 2000 caracteres.

                    Por favor, RESUMA o conteúdo mantendo a estimativa de horas e respeitando o limite de **2000 caracteres** no total.

                    Resultado anterior:
                    ${result}
                `;

                result = await this.iaRepo.generateResult(retryInput);
            }

            return DefaultOutputMapper.toOutput(result);
        }
    }
}