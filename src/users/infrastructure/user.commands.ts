import { Inject, Injectable } from "@nestjs/common";
import { CreateUser } from "../application/usecases/create-user.usecase";

@Injectable()
export class UserCommands{
    @Inject(CreateUser.Usecase)
    private createUserUsecase: CreateUser.Usecase;

    
};