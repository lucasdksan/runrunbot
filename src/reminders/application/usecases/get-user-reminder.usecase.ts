import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { UserRepository } from "../../../users/domain/repositories/user.repository";

export namespace GetUserReminder {
    export type Input = {
        userId: string;
    };

    export type Output = {
        discordId: string;
        discordUser: string;
    };

    export class Usecase implements DefaultUseCase<Input, Output> {
        constructor(
            private userRepository: UserRepository.Repository,
        ){}
        
        async execute(input: Input): Promise<Output> {
            const { userId } = input;
            const userEntity = await this.userRepository.findById(userId);
            const { discordId, discordUser } = userEntity.toJSON();
            
            return {
                discordId,
                discordUser
            };
        }
    }
}