import z from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types";
import { Resolver, Tool } from "@nestjs-mcp/server";
import { IRunrunitRepository } from "./external/runrunit/repositories/i-runrunit-repository";
import { GetDescriptionTaskDto } from "./external/runrunit/dtos/get-description-task.dto";
import { CreateCommentDto } from "./external/runrunit/dtos/create-comment.dto";
import { PauseTaskDto } from "./external/runrunit/dtos/pause-task.dto";
import { PlayTaskDto } from "./external/runrunit/dtos/play-task.dto";
import { TaskEntity } from "../domain/entities/task.entity";
import { GetCommentTaskDto } from "./external/runrunit/dtos/get-comment-task.dto";
import { TurndownProvider } from "./providers/turndown/turndown.provider";

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
        const turndown = new TurndownProvider();
        const dto = new GetDescriptionTaskDto();
        const dtoComment = new GetCommentTaskDto();

        dto.id = parseInt(taskId);
        dtoComment.id = parseInt(taskId);

        try {
            const description = await this.runrunitRepo.getDescriptionTask(dto);
            const comments = await this.runrunitRepo.getCommentTask(dtoComment);
            const commentFormat = comments.map(comment => {
                return `${comment.user_id}: ${turndown.convertHTMLtoMD(comment.text)}\n`;
            }).join("");

            return { 
                content: [{ 
                    type: "text", text: `
                        Descrição: ${TaskEntity.publicFormatDescription(description)} \n
                        Comentário: ${commentFormat}
                    `
                }] 
            };
        } catch (error) {
            console.error(error);

            return { content: [{ type: "text", text: "Erro em pegar a descrição." }] };
        }
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

        try {
            const text = await this.runrunitRepo.createComment(dto);

            return { content: [{ type: "text", text }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Error ao comentar"}] };
        }
    }

    @Tool({
        name: "play_task",
        description: "This tool allows user start the task card by simply submitting the taskID",
        paramsSchema: { taskId: z.string() }
    })
    async playTask({ taskId }:{ taskId: string }){
        const dto = new PlayTaskDto();

        dto.id = parseInt(taskId);

        try {
            await this.runrunitRepo.playTask(dto);

            return { content: [{ type: "text", text: "Tarefa iniciada" }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Erro ao iniciar tarefa" }] };
        }
    }

    @Tool({
        name: "pause_task",
        description: "This tool allows user pause the task card by simply submitting the taskID",
        paramsSchema: { taskId: z.string() }
    })
    async pauseTask({ taskId }:{ taskId: string }){
        const dto = new PauseTaskDto();

        dto.id = parseInt(taskId);

        try {
            await this.runrunitRepo.pauseTask(dto);

            return { content: [{ type: "text", text: "Tarefa pausada" }] };
        } catch (error) {
            return { content: [{ type: "text", text: "Erro ao pausar tarefa" }] };
        }
    }
}