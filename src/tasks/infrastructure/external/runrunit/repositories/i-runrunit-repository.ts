import { TaskEntity } from "../../../../domain/entities/task.entity";
import { CreateCommentDto } from "../dtos/create-comment.dto";
import { GetDescriptionTaskDto } from "../dtos/get-description-task.dto";
import { GetTaskDto } from "../dtos/get-task.dto";
import { PauseTaskDto } from "../dtos/pause-task.dto";
import { PlayTaskDto } from "../dtos/play-task.dto";

export interface IRunrunitRepository {
    getAllTasks(): Promise<any[]>;
    getTask(dto: GetTaskDto): Promise<TaskEntity>;
    getDescriptionTask(dto: GetDescriptionTaskDto): Promise<string>;
    createComment(dto: CreateCommentDto): Promise<string>;
    pauseTask(dto: PauseTaskDto): Promise<void>;
    playTask(dto: PlayTaskDto): Promise<void>;
}