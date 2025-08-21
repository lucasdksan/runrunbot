import { IsDate, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { UserProps } from "../entities/user.entity";
import { ClassValidatorFields } from "../../../shared/domain/validators/class-validator-fields";

export class UserRules {
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    discordUser: string;

    @IsString()
    @IsNotEmpty()
    discordId: string;

    @MaxLength(100)
    @IsString()
    @IsNotEmpty()
    runrunitUser: string;

    @IsDate()
    @IsOptional()
    createdAt?: Date;

    constructor({ discordUser, runrunitUser, discordId, createdAt }: UserProps) {
        Object.assign(this, { discordUser, runrunitUser, discordId, createdAt });
    }
}

export class UserValidator extends ClassValidatorFields<UserProps> {
    validate(data: UserProps): boolean {
        return super.validate(new UserRules(data ?? {} as UserProps));
    }
}

export class UserValidatorFactory {
    static create(): UserValidator {
        return new UserValidator();
    }
}