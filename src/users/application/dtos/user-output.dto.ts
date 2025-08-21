import { UserEntity } from "../../domain/entities/user.entity";

export type UserOutput = {
    id: string;
    discordUser: string;
    discordId: string;
    runrunitUser: string;
    createdAt: Date;
}

export class UserOutputMapper {
    static toOutput(entity: UserEntity):UserOutput {
        return entity.toJSON();
    }
}