import z from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types";
import { Resolver, Tool } from "@nestjs-mcp/server";
import { IRunrunitRepository } from "./external/runrunit/repositories/i-runrunit-repository";
import { GetDescriptionTaskDto } from "./external/runrunit/dtos/get-description-task.dto";
import { TaskEntity } from "../domain/entities/task.entity";
import { CreateCommentDto } from "./external/runrunit/dtos/create-comment.dto";

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

        return { content: [{ type: "text", text: TaskEntity.publicFormatText(description) }] };
    }

    @Tool({
        name: "send_comment",
        description: "This tool allows users to submit comments to the task card by simply submitting the taskID and comment.",
        paramsSchema: { taskId: z.string(), comment: z.string() },
    })
    async sendComment({ taskId, comment }: { taskId: string; comment: string; }){
        const dto = new CreateCommentDto();

        dto.taskId = parseInt(taskId);
        dto.comment = comment;

        const text = await this.runrunitRepo.createComment(dto);

        return { content: [{ type: "text", text }] };
    }
}