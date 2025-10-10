import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { EstimateTaskAgentText } from "../../../shared/infrastructure/templates/estimate-task-agent-text";
import { DefaultInputDto } from "../../../shared/infrastructure/ia/dtos/default-input.dto";
import { IIARepository } from "../../../shared/infrastructure/ia/repositories/i-ia-repository";
import { DefaultOutput, DefaultOutputMapper } from "../dtos/default-output.dto";

export namespace EstimateHours {
    export type Input = {
        text: string;
    };

    export type Output = DefaultOutput[];

    export class Usecase implements DefaultUseCase<Input, Output> {
        constructor(
            private iaRepo: IIARepository,
        ) { }

        async execute(input: Input): Promise<Output> {
            const { text } = input;
            const dto = new DefaultInputDto();

            dto.input = `
                Estime em horas o tempo necessário para fazer a seguinte tarefa.
                ${text}

                **Observação:** **LEIA DE FORMA MINUCIOSA OS SEGUINTES COMANDOS** -> ${EstimateTaskAgentText()}
            `;

            const response = await this.iaRepo.generateResult(dto);
            const responseArray = this.iaRepo.splitTextBySentence(response, 1600);

            return responseArray.map((r) => DefaultOutputMapper.toOutput(r));
        }
    }
}