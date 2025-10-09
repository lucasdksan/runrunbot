import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { DiscordService } from "../../../shared/infrastructure/discord/discord.service";
import { MessageInputDto } from "../../../shared/infrastructure/discord/dtos/message-input.dto";
import { DefaultInputDto } from "../../../shared/infrastructure/ia/dtos/default-input.dto";
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
            private discordService: DiscordService,
        ) { }

        async execute(_: Input): Promise<Output> {
            const list = await this.userRepository.findAll();
            const taskList = await this.runrunitRepo.getAllTasks();
            const taskListFiltered = TaskEntity.separationResponsibleId(taskList);
            const responseIA: {
                runrunitUser: string;
                generateResponse: string;
                generateResponseRest?: string;
                discordId: string;
                discordUser: string;
            }[] = [];

            for (const user of list) {
                let { runrunitUser, discordId, discordUser } = user.toJSON();
                let tasks = taskListFiltered[runrunitUser];
                let dto = new DefaultInputDto();
                let cleanData = TaskEntity.prepareTasksForAnalysis(tasks)

                dto.input = `
                    Você é um analista de produtividade. Recebeu uma lista de tarefas concluídas e em andamento.
                    Avalie o desempenho dos desenvolvedores com base nas informações a seguir:
                    - Tempo estimado vs. tempo trabalhado
                    - Cumprimento de prazos (estimated_delivery_date vs. close_date)
                    - Prioridades atendidas
                    - Quantidade de atividades
                    - Taxa de fechamento
                    - Volume total de tarefas por pessoa

                    Gere um relatório com:
                    1️⃣ Um resumo da performance de cada desenvolvedor.
                    2️⃣ Pontos fortes e fracos.
                    3️⃣ Sugestões para melhoria.

                    Dados: ${JSON.stringify(cleanData, null, 2)}

                    É de extrema importância o seu retorno não passar dos 1500 caracteres.

                    **Observação 1:** **NÃO GERE MAIS DE 1500 CARACTERES** .
                `;

                let generateResponse = await this.iaRepo.generateResult(dto);
                let generateResponseRest: string | undefined;

                if (generateResponse.length > 1500) {
                    const fullResponse = generateResponse;

                    const firstPart = fullResponse.substring(0, 1500);
                    const lastSpace = firstPart.lastIndexOf(" ");
                    const safeCut = lastSpace > 0 ? firstPart.substring(0, lastSpace) : firstPart;

                    generateResponse = safeCut.trim() + "...";
                    generateResponseRest = fullResponse.substring(safeCut.length).trim();
                }

                responseIA.push({
                    runrunitUser,
                    generateResponse,
                    discordId,
                    discordUser,
                    generateResponseRest
                });
            }

            for (const response of responseIA) {
                const { discordId, discordUser, generateResponse, generateResponseRest } = response;
                const mainMessage = `
                    Olá ${discordUser}! 👋

                    Aqui está seu resumo semanal de performance.  
                    Use esse feedback para continuar evoluindo nas suas entregas! 🚀

                    📊 **Resumo:**
                    ${generateResponse}
                `.trim();

                const dto = new MessageInputDto();
                dto.userId = discordId;
                dto.message = mainMessage;

                await this.discordService.sendDM(dto);

                if (generateResponseRest && generateResponseRest.trim().length > 0) {
                    const restDto = new MessageInputDto();
                    restDto.userId = discordId;
                    restDto.message = `
                        📄 **Continuação do relatório:**  
                        ${generateResponseRest}
                    `.trim();

                    await this.discordService.sendDM(restDto);
                }
            }

            return {};
        }
    }
}