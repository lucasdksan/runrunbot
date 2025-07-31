import { UserOutput, UserOutputMapper } from "../dtos/user-output.dto";
import { UseCase as DefaultUseCase } from "../../../shared/application/usecases/use-case";
import { UserRepository } from "../../domain/repositories/user.repository";
import { BadRequestError } from "../../../shared/application/errors/bad-request-error";
import { UserEntity } from "../../domain/entities/user.entity";
import { NotFoundError } from "../../../shared/domain/errors/not-found-error";

export namespace CreateUser {
    export type Input = {
        discordUser: string;
        runrunitUser: string;
    };

    export type Output = UserOutput;

    export class Usecase implements DefaultUseCase<Input, Output> {
        constructor(
            private userRepository: UserRepository.Repository,
        ){}
        
        async execute(input: Input): Promise<UserOutput> {
            const { discordUser, runrunitUser } = input;

            if(!discordUser || !runrunitUser ) throw new BadRequestError("Input data not provided");

            const discordUserExist = this.userRepository.discordUserExist(discordUser);
            const runrunitUserExist = this.userRepository.runrunitUserExist(runrunitUser);

            if(!discordUserExist || !runrunitUserExist) throw new NotFoundError("Input data not provided");

            const entity = new UserEntity({
                discordUser,
                runrunitUser
            });
            
            await this.userRepository.insert(entity);

            return UserOutputMapper.toOutput(entity);
        }
    }
};