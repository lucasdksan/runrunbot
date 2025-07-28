import { Injectable } from "@nestjs/common";
import { Context, Modal, ModalContext, On, SlashCommand, SlashCommandContext } from "necord";
import { DiscordService } from "./discord.service";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Message, ModalBuilder, TextInputBuilder } from "discord.js";
import { TextInputStyle } from "discord-api-types/v10";
import { EnvConfigService } from "src/shared/infrastructure/env-config/env-config.service";

@Injectable()
export class DiscordCommands {
    constructor(
        private readonly discordService: DiscordService,
        private readonly envConfigService: EnvConfigService,
    ) { }

    @SlashCommand({
        name: "ping",
        description: "Ping the bot to check if it's online",
    })
    public async onPing(@Context() [interaction]: SlashCommandContext) {
        const response = this.discordService.display();

        return interaction.reply({ content: response });
    }

    @SlashCommand({
        name: "task",
        description: "Fetch uma task do Runrun.it pelo ID",
    })
    public async onTask(@Context() [interaction]: SlashCommandContext) {
        const modal = new ModalBuilder()
            .setTitle("Buscar task no Runrun.it")
            .setCustomId("runrun/task")
            .addComponents([
                new ActionRowBuilder<TextInputBuilder>().addComponents(
                    new TextInputBuilder()
                        .setCustomId("taskId")
                        .setLabel("Digite o ID da task")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
            ]);

        return interaction.showModal(modal);
    }

    @SlashCommand({
        name: "gettasks",
        description: "Fetch all tasks from Runrun.it",
    })
    public async onGetTasks(@Context() [interaction]: SlashCommandContext) {
        try {
            await interaction.reply({ content: "🔄 Buscando tasks...", flags: 1 << 6 });

            const response = await fetch("https://runrun.it/api/v1.0/tasks", {
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                console.error("Erro ao buscar tasks:", response.status, response.statusText);

                return interaction.followUp({
                    content: `❌ Erro ao buscar tasks: ${response.status} ${response.statusText}`,
                    flags: 1 << 6,
                });
            }

            const tasks = await response.json();
            const pageSize = 10;
            let currentPage = 0;

            const renderPage = (page: number) => {
                const start = page * pageSize;
                const end = start + pageSize;
                const pageTasks = tasks.slice(start, end);
                const content = pageTasks.map((task: any) => `${task.id} - ${task.title}`).join('\n') || 'Sem tarefas';
                return `**Tasks ${start + 1} a ${Math.min(end, tasks.length)} de ${tasks.length}:**\n${content}`;
            };

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prev')
                        .setLabel('⏮ Anterior')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Próximo ⏭')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(tasks.length <= pageSize)
                );

            const message = await interaction.followUp({
                content: renderPage(currentPage),
                components: [row],
                flags: 1 << 6,
            });

            const collector = message.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 60000,
            });

            collector.on('collect', async i => {
                if (i.customId === 'prev' && currentPage > 0) currentPage--;
                if (i.customId === 'next' && (currentPage + 1) * pageSize < tasks.length) currentPage++;

                row.components[0].setDisabled(currentPage === 0);
                row.components[1].setDisabled((currentPage + 1) * pageSize >= tasks.length);

                await i.update({ content: renderPage(currentPage), components: [row] });
            });

            collector.on('end', async () => {
                row.components.forEach(b => b.setDisabled(true));
                try {
                    await message.edit({ components: [row] });
                } catch (err) {
                    console.log("Não foi possível editar a mensagem (provavelmente deletada).");
                }
            });

        } catch (error) {
            console.error("Erro ao buscar tasks:", error);
            return interaction.followUp({
                content: `❌ Ocorreu um erro ao processar as tasks.`,
                flags: 1 << 6,
            });
        }
    }

    @SlashCommand({
        name: "starttask",
        description: "Inicia uma task no Runrun.it",
    })
    public async startTask(@Context() [interaction]: SlashCommandContext) {
        const modal = new ModalBuilder()
            .setTitle("Iniciar task no Runrun.it")
            .setCustomId("runrun/taskstart")
            .addComponents([
                new ActionRowBuilder<TextInputBuilder>().addComponents(
                    new TextInputBuilder()
                        .setCustomId("taskId")
                        .setLabel("Digite o ID da task")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
            ]);

        return interaction.showModal(modal);
    }

    @SlashCommand({
        name: "pausetask",
        description: "Pausa uma task no Runrun.it",
    })
    public async pauseTask(@Context() [interaction]: SlashCommandContext) {
        const modal = new ModalBuilder()
            .setTitle("Pausar task no Runrun.it")
            .setCustomId("runrun/taskpause")
            .addComponents([
                new ActionRowBuilder<TextInputBuilder>().addComponents(
                    new TextInputBuilder()
                        .setCustomId("taskId")
                        .setLabel("Digite o ID da task")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
            ]);

        return interaction.showModal(modal);
    }

    @Modal("runrun/task")
    public async onTaskSubmit(@Context() [interaction]: ModalContext) {
        const taskId = interaction.fields.getTextInputValue("taskId");

        try {
            await interaction.reply({ content: `🔄 Buscando task **${taskId}**...`, flags: 1 << 6 });

            const response = await fetch(`https://secure.runrun.it/api/v1.0/tasks/${taskId}`, {
                headers: this.getHeaders(),
            });

            const responseDescription = await fetch(`https://secure.runrun.it/api/v1.0/tasks/${taskId}/description`, {
                headers: this.getHeaders(),
            });

            const dataDescription = await responseDescription.json();

            console.log("dataDescription", dataDescription);

            if (!response.ok) {
                return interaction.followUp({
                    content: `❌ Erro ao buscar task: ${response.status} ${response.statusText}`,
                    flags: 1 << 6,
                });
            }

            const taskData = await response.json();

            return interaction.followUp({
                content: `✅ Tarefa\n * Task **${taskData.id}**: ${taskData.title}\n * Status: ${taskData.board_stage_name}\n * Descrição: ${this.formatRunrunMessage(dataDescription.description)}`,
                flags: 1 << 6,
            });
        } catch (error) {
            console.error("Erro ao buscar task:", error);
            return interaction.followUp({
                content: `❌ Ocorreu um erro ao processar a task.`,
                flags: 1 << 6,
            });
        }
    }

    @Modal("runrun/taskstart")
    public async onTaskStartSubmit(@Context() [interaction]: ModalContext) {
        const taskId = interaction.fields.getTextInputValue("taskId");

        try {
            await interaction.reply({
                content: `🔄 Iniciando task **${taskId}**...`,
                flags: 1 << 6
            });

            const response = await fetch(`https://secure.runrun.it/api/v1.0/tasks/${taskId}/play`, {
                headers: this.getHeaders(),
                method: "POST"
            });

            if (!response.ok) {
                return interaction.followUp({
                    content: `❌ Erro ao iniciar task: ${response.status} ${response.statusText}`,
                    flags: 1 << 6,
                });
            }

            return interaction.followUp({
                content: `✅ Task iniciada com sucesso!`,
                flags: 1 << 6,
            });
        } catch (error) {
            console.error("Erro ao iniciar task:", error);
            return interaction.followUp({
                content: `❌ Ocorreu um erro ao processar a task.`,
                flags: 1 << 6,
            });
        }
    }

    @Modal("runrun/taskpause")
    public async onTaskPauseSubmit(@Context() [interaction]: ModalContext) {
        const taskId = interaction.fields.getTextInputValue("taskId");

        try {
            await interaction.reply({
                content: `🔄 Pausando task **${taskId}**...`,
                flags: 1 << 6
            });

            const response = await fetch(`https://secure.runrun.it/api/v1.0/tasks/${taskId}/pause`, {
                headers: this.getHeaders(),
                method: "POST"
            });

            if (!response.ok) {
                return interaction.followUp({
                    content: `❌ Erro ao pausar task: ${response.status} ${response.statusText}`,
                    flags: 1 << 6,
                });
            }

            return interaction.followUp({
                content: `✅ Task pausada com sucesso!`,
                flags: 1 << 6,
            });
        } catch (error) {
            console.error("Erro ao pausar task:", error);
            return interaction.followUp({
                content: `❌ Ocorreu um erro ao processar a task.`,
                flags: 1 << 6,
            });
        }
    }

    @On('messageCreate')
    public async onMessageCreate(@Context() [message]: [Message]) {
        // Ignorar mensagens do próprio bot
        if (message.author.bot) return;


        console.log(`Mensagem recebida de ${message.author.tag}: ${message}`);

        // Checar se é "bom dia" (case-insensitive)
        if (message.content.toLowerCase() === 'bom dia' || message.content.toLowerCase() === 'iniciando') {
            try {
                await message.react("✅");

                const result = await this.discordService.getTasks();

                if (result.length === 0) {
                    await message.author.send(`Olá ${message.author.username}!\nVocê não possui tarefas para produção no momento.`);
                    return;
                }

                const text = result.map(task => `* ID: ${task.id}, Título: ${task.title}`).join('\n');

                await message.author.send(`Olá ${message.author.username}!\nVocê possui as seguintes tarefa para produção: \n ${text}`);
            } catch (err) {
                console.error(`Não consegui enviar DM para ${message.author.tag}:`, err);
            }
        }

        if (message.content.toLowerCase() === 'encerrando') {
            try {
                await message.react("✅");

                const result = await this.discordService.getTasksOn();

                if (result.length === 0) {
                    await message.author.send(`Olá ${message.author.username}!\nVocê não possui tarefas ativados.`);
                    return;
                }

                const text = result.map(task => `* ID: ${task.id}, Título: ${task.title}`).join('\n');
                const ids = result.map(task => parseInt(task.id));

                await message.author.send(`Olá ${message.author.username}!\nVocê possui as seguintes tarefa ativadas: \n ${text}\n Vou pausar elas!`);

                await this.discordService.pauseTasks(ids);

                await message.author.send({
                    content: "https://tenor.com/view/nice-to-meet-you-cat-cute-sunglasses-shades-on-gif-18420446188833474915",
                });
            } catch (err) {
                console.error(`Não consegui enviar DM para ${message.author.tag}:`, err);
            }
        }
    }

    private formatRunrunMessage(html: string) {
        if (!html) return '';

        // Substitui <br> por nova linha
        let text = html.replace(/<br\s*\/?>/gi, '\n');

        // Converte <b> para **negrito**
        text = text.replace(/<b>(.*?)<\/b>/gi, '**$1**');

        // Converte links <a href="url">texto</a> para apenas a URL (ou texto [url])
        text = text.replace(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '$1');

        // Remove todas as outras tags HTML
        text = text.replace(/<\/?[^>]+(>|$)/g, '');

        // Remove espaços extras
        text = text.replace(/\n\s+\n/g, '\n\n').trim();

        // Limita para evitar cortes no Discord (máx. 2000 caracteres)
        if (text.length > 1900) {
            text = text.slice(0, 1900) + '\n... [mensagem truncada]';
        }

        return text;
    }

    private getHeaders() {
        return {
            "App-Key": this.envConfigService.getRunrunAppKey(),
            "User-Token": this.envConfigService.getRunrunUserToken(),
            "Content-Type": "application/json"
        };
    }
}