import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { DiscordProvider } from "../../shared/infrastructure/discord/discord.provider";
import { EnvConfigService } from "../../shared/infrastructure/env-config/env-config.service";
import { GetAllReminder } from "../application/usecases/get-all-reminder.usecase";
import { SendMessageReminder } from "../application/usecases/send-message-reminder.usecase";

@Injectable()
export class ReminderSchedules {
    private discordProvider: DiscordProvider;
    private readonly logger = new Logger(ReminderSchedules.name);

    @Inject(GetAllReminder.Usecase)
    private getAllReminderUsecase: GetAllReminder.Usecase;

    @Inject(SendMessageReminder.Usecase)
    private sendMessageReminderUsecase: SendMessageReminder.Usecase;

    constructor(private readonly envConfigService: EnvConfigService) {
        this.discordProvider = new DiscordProvider(
            this.envConfigService.getDiscordToken()
        );
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        const listReminder = await this.getAllReminderUsecase.execute();
        const { message } = await this.sendMessageReminderUsecase.execute({ listReminder, discordProvider: this.discordProvider });
        
        this.logger.log(message);

        // for (const reminder of channelReminders) {
        //     if (this.shouldTrigger(reminder)) {
        //         await this.discordProvider.sendToChannel(
        //             reminder.channelId,
        //             reminder.message
        //         );

        //         this.logger.log(
        //             `Enviado lembrete para canal ${reminder.channelId}`
        //         );
        //         // aqui você pode marcar como "reminded = true" no banco
        //     }
        // }
    }
}
