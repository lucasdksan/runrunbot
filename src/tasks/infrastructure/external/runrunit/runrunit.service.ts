import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { validateSync } from "class-validator";
import { EnvConfigService } from "../../../../shared/infrastructure/env-config/env-config.service";
import { RunrunitTaskMapper } from "./models/task-model.mapper";
import { GetTaskDto } from "./dtos/get-task.dto";
import { GetDescriptionTaskDto } from "./dtos/get-description-task.dto";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { IRunrunitRepository } from "./repositories/i-runrunit-repository";
import { PauseTaskDto } from "./dtos/pause-task.dto";

@Injectable()
export class RunrunitService implements IRunrunitRepository {
    private readonly baseUrl = "https://runrun.it/api/v1.0";

    constructor(
        private readonly envConfigService: EnvConfigService,
    ) { }

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
                ...taskData,
                description: descData.description,
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

    public async createComment(dto: CreateCommentDto): Promise<void> {
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
            })
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

    private getHeader() {
        return {
            "App-Key": this.envConfigService.getRunrunAppKey(),
            "User-Token": this.envConfigService.getRunrunUserToken(),
            "Content-Type": "application/json"
        }
    }
}