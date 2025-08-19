import {
    IsDate,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    IsIn,
    IsBoolean,
} from "class-validator";
import { ReminderProps } from "../entities/reminder.entity";
import { ClassValidatorFields } from "../../../shared/domain/validators/class-validator-fields";

export class ReminderRules {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsOptional()
    channelId?: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    message: string;

    @IsDate()
    remindAt: Date;

    @IsIn(["DM", "CHANNEL"])
    sendTo: "DM" | "CHANNEL";

    @IsBoolean()
    @IsOptional()
    reminded?: boolean;

    @IsDate()
    @IsOptional()
    createdAt?: Date;

    constructor({
        userId,
        channelId,
        message,
        remindAt,
        sendTo,
        reminded,
        createdAt,
    }: ReminderProps) {
        Object.assign(this, {
            userId,
            channelId,
            message,
            remindAt,
            sendTo,
            reminded,
            createdAt,
        });
    }
}

export class ReminderValidator extends ClassValidatorFields<ReminderProps> {
    validate(data: ReminderProps): boolean {
        return super.validate(new ReminderRules(data ?? ({} as ReminderProps)));
    }
}

export class ReminderValidatorFactory {
    static create(): ReminderValidator {
        return new ReminderValidator();
    }
}
