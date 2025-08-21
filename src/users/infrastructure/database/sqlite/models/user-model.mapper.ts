import { ValidationError } from "../../../../../shared/domain/errors/validation-error";
import { UserEntity } from "../../../../domain/entities/user.entity";

export type UserModelMapperInput = {
    id: string;
    discordUser: string;
    discordId: string;
    runrunitUser: string;
    createdAt: string;
};

export class UserModelMapper {
    static toEntity(model: UserModelMapperInput){
        const data = {
            discordUser: model.discordUser,
            runrunitUser: model.runrunitUser,
            discordId: model.discordId,
            createdAt: new Date(model.createdAt)
        };

        try {
            return new UserEntity(data, model.id);
        } catch(err) {
            throw new ValidationError("An entity not be loaded");
        }
    }
}