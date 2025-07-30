import { IsNotEmpty, IsString } from "class-validator";
import { CreateUser } from "../../application/usecases/create-user.usecase";

export class CreateUserDto implements CreateUser.Input {
    @IsString()
    @IsNotEmpty()
    discordUser: string;
    
    @IsString()
    @IsNotEmpty()
    runrunitUser: string;
}