import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { validateSync } from "class-validator";
import { EnvConfigService } from "../../../../shared/infrastructure/env-config/env-config.service";
import { RunrunitTaskMapper } from "./models/task-model.mapper";
import { GetTaskDto } from "./dtos/get-task.dto";
import { GetDescriptionTaskDto } from "./dtos/get-description-task.dto";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { IRunrunitRepository } from "./repositories/i-runrunit-repository";
import { PauseTaskDto } from "./dtos/pause-task.dto";
import { PlayTaskDto } from "./dtos/play-task.dto";
import { GetCommentTaskDto } from "./dtos/get-comment-task.dto";
import { CommentProps, RunrunitCommentsMapper } from "./models/comments-model.mapper";

@Injectable()
export class RunrunitService implements IRunrunitRepository {
    private readonly baseUrl = "https://runrun.it/api/v1.0";

    constructor(
        private readonly envConfigService: EnvConfigService,
    ) { }
    
    async getCommentTask(dto: GetCommentTaskDto): Promise<CommentProps[]> {
        const errors = validateSync(dto);

        if (errors.length > 0) {
            throw new Error("Dados inválidos para getDescriptionTask");
        }

        try {
            const response = await fetch(`${this.baseUrl}/tasks/${dto.id}/comments`, {
                headers: this.getHeader(),
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar os comentários da tarefa ${dto.id}. Status: ${response.status}`);
            }

            const data = await response.json();
            
            if(!Array.isArray(data)) throw new Error(`Erro ao buscar os comentários da tarefa ${dto.id}. Status: ${response.status}`);

            return RunrunitCommentsMapper.toCommentArray(data);
        } catch (error) {
            console.error(`Erro em getCommentTask(${dto.id}):`, error);
            throw error;
        }
    }

    public async getAllTasks(): Promise<any[]> {
        try {
            const response = await fetch(`${this.baseUrl}/tasks`, {
                headers: this.getHeader(),
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar todas as tarefas. Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erro em getAllTasks():", error);
            throw error;
        }
    }

    public async getTask(dto: GetTaskDto) {
        const errors = validateSync(dto);

        if (errors.length > 0) {
            throw new Error("Dados inválidos para getTask");
        }

        try {
            const [taskRes, descRes] = await Promise.all([
                fetch(`${this.baseUrl}/tasks/${dto.id}`, { headers: this.getHeader() }),
                fetch(`${this.baseUrl}/tasks/${dto.id}/description`, { headers: this.getHeader() }),
            ]);

            if (!taskRes.ok || !descRes.ok) {
                throw new Error(`Erro ao buscar tarefa ou descrição. Status: ${taskRes.status}, ${descRes.status}`);
            }

            const [taskData, descData] = await Promise.all([taskRes.json(), descRes.json()]);

            return RunrunitTaskMapper.toEntity({
                assignments: taskData.assignments.map((assignment) => ({
                    assignee_id: assignment.assignee_id,
                    assignee_name: assignment.assignee_name,
                    start_date: assignment.start_date ?? "",
                })),
                board_stage_name: taskData.board_stage_name,
                is_working_on: taskData.is_working_on,
                task_tags: taskData.task_tags,
                title: taskData.title,
                description: descData.description,
                id: taskData.id
            });
        } catch (error) {
            console.error("Erro ao buscar tarefa:", error);
            throw error;
        }
    }

    public async getDescriptionTask(dto: GetDescriptionTaskDto): Promise<string> {
        const errors = validateSync(dto);

        if (errors.length > 0) {
            throw new Error("Dados inválidos para getDescriptionTask");
        }

        try {
            const response = await fetch(`${this.baseUrl}/tasks/${dto.id}/description`, {
                headers: this.getHeader(),
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar descrição da tarefa ${dto.id}. Status: ${response.status}`);
            }

            const data = await response.json();
            
            return data.description;
        } catch (error) {
            console.error(`Erro em getDescriptionTask(${dto.id}):`, error);
            throw error;
        }
    }

    public async createComment(dto: CreateCommentDto): Promise<string> {
        const errors = validateSync(dto);

        if (errors.length > 0) {
            throw new Error("Dados inválidos para getDescriptionTask");
        }

        try {
            const response = await fetch(`${this.baseUrl}/comments`, {
                method: "POST",
                headers: this.getHeader(),
                body: JSON.stringify({
                    task_id: dto.taskId,
                    text: dto.comment,
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro ao criar comentário para a tarefa ${dto.taskId}. Status: ${response.status}`);
            }

            return "Enviado com sucesso!";
        } catch (error) {
            console.error(`Erro em createComment(${dto.taskId}):`, error);
            throw error;
        }
    }

    public async pauseTask(dto: PauseTaskDto): Promise<void> {
        const errors = validateSync(dto);

        if (errors.length > 0) {
            errors.map((err) => {
                console.log("Err: ", err.toString())
            });
            
            throw new BadRequestException({
                message: "Dados inválidos para pauseTask",
                errors: errors.map((e) => ({
                    property: e.property,
                    constraints: e.constraints,
                })),
            });
        }

        try {
            const response = await fetch(`${this.baseUrl}/tasks/${dto.id}/pause`, {
                method: "POST",
                headers: this.getHeader(),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new HttpException(
                    `Falha ao pausar task com id ${dto.id}. Status: ${response.status}. ${errorText}`,
                    response.status as HttpStatus
                );
            }
        } catch (error) {
            console.error(`Erro em pauseTask(${dto.id}):`, error);
            throw new HttpException(
                `Erro interno ao pausar a task ${dto.id}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public async playTask(dto: PlayTaskDto): Promise<void> {
        const errors = validateSync(dto);

        if (errors.length > 0) {
            errors.map((err) => {
                console.log("Err: ", err.toString())
            });

            throw new BadRequestException({
                message: "Dados inválidos para pauseTask",
                errors: errors.map((e) => ({
                    property: e.property,
                    constraints: e.constraints,
                })),
            });
        }

        try {
            const response = await fetch(`${this.baseUrl}/tasks/${dto.id}/play`, {
                method: "POST",
                headers: this.getHeader(),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new HttpException(
                    `Falha ao pausar task com id ${dto.id}. Status: ${response.status}. ${errorText}`,
                    response.status as HttpStatus
                );
            }
        } catch (error) {
            console.error(`Erro em pauseTask(${dto.id}):`, error);
            throw new HttpException(
                `Erro interno ao pausar a task ${dto.id}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    private getHeader() {
        return {
            "App-Key": this.envConfigService.getRunrunAppKey(),
            "User-Token": this.envConfigService.getRunrunUserToken(),
            "Content-Type": "application/json"
        }
    }
}