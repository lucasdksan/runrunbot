import { IsNotEmpty, IsNumber } from "class-validator";
import { EstimateTask } from "../../application/usecases/estimate-task.usecase";

export class EstimateTaskDto implements EstimateTask.Input {
    @IsNotEmpty()
    @IsNumber()
    taskId: number;
}