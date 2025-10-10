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

                dto.input = this.buildPrompt(cleanData, user.getRole());

                let generateResponse = await this.iaRepo.generateResult(dto);
                let generateResponses = this.iaRepo.splitTextBySentence(generateResponse, 1500);

                responseIA.push({
                    runrunitUser,
                    generateResponses,
                    discordId,
                    discordUser,
                });
            }

            for (const response of responseIA) {
                const { discordId, discordUser, generateResponses } = response;
                const listMessages = DiscordMessageIAModel.build(discordId, discordUser, generateResponses);

                for (const dtoMessage of listMessages) {
                    await this.discordService.sendDM(dtoMessage);
                }
            }

            return;
        }

        private buildPrompt(tasks: any[], role: string): string {
            const baseContext = `
                Você é um analista de produtividade e desempenho de equipes de tecnologia.
                Recebeu uma lista de tarefas concluídas e em andamento, e deve gerar uma análise
                personalizada conforme o papel da pessoa avaliada (desenvolvedor ou gestor).
                Os dados estão no formato JSON e contêm informações como:
                - Tempo estimado vs. tempo trabalhado
                - Cumprimento de prazos (estimated_delivery_date vs. close_date)
                - Prioridades atendidas
                - Quantidade de atividades
                - Taxa de fechamento
                - Volume total de tarefas
            `;

            if (role.toLowerCase() === "dev" || role.toLowerCase() === "desenvolvedor") {
                return `
                    ${baseContext}

                    👉 **Contexto**: Este relatório é para um **desenvolvedor individual**.
                    Analise as tarefas e gere um feedback técnico e comportamental sobre sua performance.

                    **Objetivo da análise:**
                    - Avaliar produtividade, foco e qualidade da entrega.
                    - Comparar tempo estimado vs. tempo real e prazos cumpridos.
                    - Identificar padrões de melhoria (ex: excesso de retrabalho, gargalos, ouciosidade).
                    - Oferecer sugestões práticas de melhoria individual.

                    **Estrutura esperada:**
                    1️⃣ Resumo geral da produtividade do desenvolvedor.  
                    2️⃣ Pontos fortes (habilidades, constância, entregas notáveis).  
                    3️⃣ Pontos de melhoria (organização, prazos, volume de entregas).  
                    4️⃣ Recomendações objetivas para evolução.

                    **Dados para análise:**
                    ${JSON.stringify(tasks, null, 2)}
                `;
            }

            if (role.toLowerCase() === "gestor" || role.toLowerCase() === "manager") {
                return `
                    ${baseContext}

                    👉 **Contexto**: Este relatório é para um **gestor de equipe**.
                    Analise o desempenho com foco em **liderança, alocação de tarefas, eficiência da equipe e planejamento**.

                    **Objetivo da análise:**
                    - Avaliar a produtividade da equipe sob sua gestão.
                    - Medir se o volume de trabalho está equilibrado entre os membros.
                    - Identificar possíveis sobrecargas ou subutilização.
                    - Avaliar a pontualidade das entregas e cumprimento de estimativas.
                    - Oferecer insights estratégicos para melhorar a gestão da equipe.

                    **Estrutura esperada:**
                    1️⃣ Visão geral da performance da equipe.  
                    2️⃣ Pontos fortes da gestão (organização, comunicação, priorização).  
                    3️⃣ Riscos e oportunidades de melhoria (distribuição de tarefas, prazos, planejamento).  
                    4️⃣ Sugestões práticas de gestão (revisão de processos, acompanhamento, coaching).

                    **Dados para análise:**
                    ${JSON.stringify(tasks, null, 2)}
                `;
            }

            return `
                ${baseContext}

                Gere uma análise geral de produtividade e desempenho com base nas tarefas fornecidas.

                **Dados:**
                ${JSON.stringify(tasks, null, 2)}
            `;
        }
    }
}