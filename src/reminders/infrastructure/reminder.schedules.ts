import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { GetAllReminder } from "../application/usecases/get-all-reminder.usecase";
import { SendMessageReminder } from "../application/usecases/send-message-reminder.usecase";

@Injectable()
export class ReminderSchedules {
    private readonly logger = new Logger(ReminderSchedules.name);

    @Inject(GetAllReminder.Usecase)
    private getAllReminderUsecase: GetAllReminder.Usecase;

    @Inject(SendMessageReminder.Usecase)
    private sendMessageReminderUsecase: SendMessageReminder.Usecase;

    constructor() {}

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        const listReminder = await this.getAllReminderUsecase.execute();
        const { message } = await this.sendMessageReminderUsecase.execute({ listReminder });
        
        this.logger.log(message);
    }
}
