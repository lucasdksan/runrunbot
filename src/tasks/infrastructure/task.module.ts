import { Module } from "@nestjs/common";
import { RunrunitModule } from "./external/runrunit/runrunit.module";
import { TaskCommands } from "./task.commands";

@Module({
    imports: [RunrunitModule],
    providers: [TaskCommands]
})
export class TaskModule {};