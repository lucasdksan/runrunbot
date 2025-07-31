import { TaskEntity } from "../../../../domain/entities/task.entity";

export class RunrunitTaskMapper {
    static toEntity(external: any): TaskEntity {
        return new TaskEntity({
            task_tags: external.task_tags,
            title: external.title,
            assignments: external.assignments, 
            description: external.description,
            board_stage_name: external.board_stage_name, 
            is_working_on: external.is_working_on,
        }, external.id);
    }
}