import z from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types";
import { Resolver, Tool } from "@nestjs-mcp/server";
import { IRunrunitRepository } from "./external/runrunit/repositories/i-runrunit-repository";
import { GetDescriptionTaskDto } from "./external/runrunit/dtos/get-description-task.dto";

@Resolver("tasks")
export class TaskTools {
    constructor(
        private runrunitRepo: IRunrunitRepository,
    ) { }

    @Tool({
        name: "get_description",
        description: "This tool allows the user to obtain the description of a task by placing the task number in the input taskId",
        paramsSchema: { taskId: z.string() },
    })
    async getDescription({ taskId }: { taskId: string; }): Promise<CallToolResult> {
        const dto = new GetDescriptionTaskDto();
        dto.id = parseInt(taskId);

        const description = await this.runrunitRepo.getDescriptionTask(dto);

        return { content: [{ type: "text", text: description }] };
    }
}