import { Module } from "@nestjs/common";
import { UserCommands } from "./user.commands";

@Module({
    imports: [],
    controllers: [],
    providers: [UserCommands],
    exports: [],
})
export class UserModule {};