import { Entity } from "../../../shared/domain/entity/entity";
import { EntityValidationError } from "../../../shared/domain/errors/validation-error";
import { ReminderValidatorFactory } from "../validators/reminder.validator";

export type ReminderProps = {
    userId: string;
    message: string;
    remindAt: Date;
    reminded?: boolean;
    createdAt?: Date;
};

export class ReminderEntity extends Entity<ReminderProps> {
    constructor(public readonly props: ReminderProps, id?: string) {
        ReminderEntity.validate(props);
        super(props, id);

        this.props.createdAt = this.props.createdAt ?? new Date();
        this.props.reminded = this.props.reminded ?? false;
    }


    update(values: Partial<Pick<ReminderProps, "message" | "remindAt">>): void {
        const newProps = { ...this.props, ...values };
        ReminderEntity.validate(newProps);

        if (values.message !== undefined) {
            this.message = values.message;
        }

        if (values.remindAt !== undefined) {
            this.remindAt = values.remindAt;
        }
    }

    private set message(value: string) {
        this.props.message = value;
    }

    private set remindAt(value: Date) {
        this.props.remindAt = value;
    }

    get userId() {
        return this.props.userId;
    }

    get message() {
        return this.props.message;
    }

    get remindAt() {
        return this.props.remindAt;
    }

    get reminded() {
        return this.props.reminded ?? false;
    }

    set reminded(value: boolean) {
        this.props.reminded = value;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    static validate(props: ReminderProps) {
        const validator = ReminderValidatorFactory.create();
        const isValid = validator.validate(props);

        if (!isValid) {
            throw new EntityValidationError(validator.errors ? validator.errors : {});
        }
    }
}