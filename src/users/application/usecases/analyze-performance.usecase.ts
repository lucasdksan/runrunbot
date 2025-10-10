import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { DiscordService } from "../../../shared/infrastructure/discord/discord.service";
import { DiscordMessageIAModel } from "../../../shared/infrastructure/discord/models/discord-message-ia.model";
import { DefaultInputDto } from "../../../shared/infrastructure/ia/dtos/default-input.dto";
import { IIARepository } from "../../../shared/infrastructure/ia/repositories/i-ia-repository";
import { IRunrunitRepository } from "../../../shared/infrastructure/runrunit/repositories/i-runrunit-repository";
import { TaskEntity } from "../../../tasks/domain/entities/task.entity";
import { UserRepository } from "../../domain/repositories/user.repository";

export namespace AnalyzePerformance {
    export type Input = void;

    export type Output = void;

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
                generateResponses: string[];
                discordId: string;
                discordUser: string;
            }[] = [];

            for (const user of list) {
                let { runrunitUser, discordId, discordUser } = user.toJSON();
                let tasks = taskListFiltered[runrunitUser];
                let dto = new DefaultInputDto();
                let cleanData = TaskEntity.prepareTasksForAnalysis(tasks)

                dto.input = this.buildPrompt(cleanData);

                let generateResponse = await this.iaRepo.generateResult(dto);
                let generateResponseArray = this.iaRepo.splitTextBySentence(generateResponse, 1500);

                responseIA.push({
                    runrunitUser,
                    generateResponses: generateResponseArray,
                    discordId,
                    discordUser,
                });
            }

            for (const response of responseIA) {
                const { discordId, discordUser, generateResponses } = response;
                const listMessages = DiscordMessageIAModel.build(discordId, discordUser, generateResponses);

                for(const dtoMessage of listMessages) {
                    await this.discordService.sendDM(dtoMessage);
                }
            }

            return;
        }

        private buildPrompt(tasks: any[]): string {
            return `
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

                Dados: ${JSON.stringify(tasks, null, 2)}

                É de extrema importância o seu retorno não passar dos 1500 caracteres.
            `;
        }
    }
}