import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { EstimateTaskAgentText } from "../../../shared/infrastructure/templates/estimate-task-agent-text";
import { IIARepository } from "../../infrastructure/external/ia/repositories/i-ia-repository";

export namespace EstimateHours {
    export type Input = {
        text: string;
    };

    export type Output = {
        message: string;
    };

    export class Usecase implements DefaultUseCase<Input, Output> {
        constructor(
            private iaRepo: IIARepository,
        ) { }

        async execute(input: Input): Promise<Output> {
            const { text } = input;
            const response = await this.iaRepo.generateResult(`
                Estime em horas o tempo necessário para fazer a seguinte tarefa considerando 1 hora de gordura.
                ${text}

                Observação 1: RETORNE APENAS A HORAS SEM DESCRIÇÃO.
                Observação 2: LEIA DE FORMA MINUCIOSA OS SEGUINTES COMANDOS -> ${EstimateTaskAgentText()}
            `);

            return {
                message: response,
            }
        }
    }
}