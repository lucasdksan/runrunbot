import { Inject, Injectable } from "@nestjs/common";
import { ActionRowBuilder, Message, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Context, Modal, ModalContext, On, SlashCommand, SlashCommandContext } from "necord";
import { StartWork } from "../application/usecases/start-work.usecase";
import { EndWork } from "../application/usecases/end-work.usecase";
import { EstimateHours } from "../application/usecases/estimate-hours.usecase";
import { EstimateTask } from "../application/usecases/estimate-task.usecase";

@Injectable()
export class TaskCommands {
    @Inject(StartWork.Usecase)
    private startWorkUsecase: StartWork.Usecase;

    @Inject(EndWork.Usecase)
    private endWorkUsecase: EndWork.Usecase;

    @Inject(EstimateHours.Usecase)
    private estimateHoursUsecase: EstimateHours.Usecase;

    @Inject(EstimateTask.Usecase)
    private estimateTaskUsecase: EstimateTask.Usecase;

    @On("messageCreate")
    public async onStartWork(@Context() [message]: [Message]) {
        if (message.author.bot) return;

        if (message.content.toLowerCase() === "bom dia" || message.content.toLowerCase() === "iniciando") {
            try {
                const discordUser = message.author.username;

                await message.react("✅");

                const { message: response } = await this.startWorkUsecase.execute({ discordUser });

                await message.author.send(response);
            } catch (err) {
                console.error(`Não consegui enviar DM para ${message.author.tag}:`, err);
            }
        }
    }

    @On("messageCreate")
    public async onEndWork(@Context() [message]: [Message]) {
        if (message.author.bot) return;

        if (message.content.toLowerCase() === "encerrando" || message.content.toLowerCase() === "almoço") {
            try {
                const discordUser = message.author.username;

                await message.react("✅");

                const { message: response } = await this.endWorkUsecase.execute({ discordUser, userInput: message.content });

                await message.author.send(response);
            } catch (err) {
                console.error(`Não consegui enviar DM para ${message.author.tag}:`, err);
            }
        }
    }

    @SlashCommand({
        name: "estimate",
        description: "Estimar horas de uma tarefa usando IA.",
    })
    public async onEstimate(@Context() [interaction]: SlashCommandContext) {
        const modal = new ModalBuilder()
            .setTitle("Estimar horas da tarefa")
            .setCustomId("estimate")
            .addComponents([
                new ActionRowBuilder<TextInputBuilder>().addComponents(
                    new TextInputBuilder()
                        .setCustomId("description")
                        .setLabel("Digite a descrição")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                ),
            ]);

        return interaction.showModal(modal);
    }

    @Modal("estimate")
    public async onEstimateModal(@Context() [interaction]: ModalContext) {
        const description = interaction.fields.getTextInputValue("description");

        try {
            await interaction.reply({ content: "Isso pode levar alguns minutos", flags: 1 << 6 });

            const response = await this.estimateHoursUsecase.execute({ text: description });

            return interaction.followUp({
                content: response.message,
                flags: 1 << 6,
            });
        } catch (error) {
            console.error("Erro ao estimar as horas: ", error);
            return interaction.followUp({
                content: "Erro ao estimar",
                flags: 1 << 6,
            });
        }
    }

    @SlashCommand({
        name: "estimate_task",
        description: "Estimar as horas de uma tarefa registrada."
    })
    public async onEstimateTask(@Context() [interaction]: SlashCommandContext) {
        const modal = new ModalBuilder()
            .setTitle("Cotação da tarefa")
            .setCustomId("estimate_task")
            .addComponents([
                new ActionRowBuilder<TextInputBuilder>().addComponents(
                    new TextInputBuilder()
                        .setCustomId("taskId")
                        .setLabel("Digite o id da tarefa")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
            ]);

        return interaction.showModal(modal);
    }

    @Modal("estimate_task")
    public async onEstimateTaskModal(@Context() [interaction]: ModalContext) {
        const taskId = interaction.fields.getTextInputValue("taskId");

        try {
            await interaction.reply({ content: "Isso pode levar alguns minutos.\nVou procurar a tarefa.", flags: 1 << 6 });

            const response = await this.estimateTaskUsecase.execute({ taskId: parseInt(taskId) });

            return interaction.followUp({
                content: response.message,
                flags: 1 << 6,
            });
        } catch (error) {
            console.error("Erro ao estimar as horas: ", error);
            return interaction.followUp({
                content: "Erro ao estimar tarefa",
                flags: 1 << 6,
            });
        }
    }
}