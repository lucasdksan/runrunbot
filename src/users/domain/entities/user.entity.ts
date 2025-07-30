import { Entity } from "../../../shared/domain/entity/entity";
import { EntityValidationError } from "../../../shared/domain/errors/validation-error";
import { UserValidatorFactory } from "../validators/user.validator";

export type UserProps = {
    discordUser: string;
    runrunitUser: string;
    createdAt?: Date;
};

export class UserEntity extends Entity<UserProps> {
    constructor(public readonly props: UserProps, id?: string) {
        UserEntity.validate(props);
        super(props, id);
        this.props.createdAt = this.props.createdAt ?? new Date();
    }

    update(values: Partial<Pick<UserProps, "discordUser" | "runrunitUser">>): void {
        const newProps = { ...this.props, ...values };
        UserEntity.validate(newProps);

        if (values.discordUser !== undefined) {
            this.discordUser = values.discordUser;
        }

        if (values.runrunitUser !== undefined) {
            this.runrunitUser = values.runrunitUser;
        }
    }

    private set discordUser(value: string) {
        this.props.discordUser = value;
    }

    private set runrunitUser(value: string) {
        this.props.runrunitUser = value;
    }

    get runrunitUser() {
        return this.props.runrunitUser;
    }

    get discordUser() {
        return this.props.discordUser;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    static validate(props: UserProps) {
        const validator = UserValidatorFactory.create();
        const isValid = validator.validate(props);

        if (!isValid) {
            throw new EntityValidationError(validator.errors ? validator.errors : {});
        }
    }
}