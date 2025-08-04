import {
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
    ArrayNotEmpty,
} from "class-validator";
import { ClassValidatorFields } from "../../../shared/domain/validators/class-validator-fields";
import { TaskProps } from "../entities/task.entity";

class AssignmentRules {
    @IsString()
    @IsNotEmpty()
    assignee_id: string;

    @IsString()
    @IsNotEmpty()
    assignee_name: string;

    @IsOptional()
    start_date?: string;

    constructor(props: AssignmentRules) {
        Object.assign(this, props);
    }
}

export class TaskRules {
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    task_tags: string[];

    @IsString()
    @IsNotEmpty()
    title: string;

    assignments: AssignmentRules[];

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    @IsNotEmpty()
    board_stage_name: string;

    constructor(props: TaskProps) {
        Object.assign(this, props);
    }
}

export class TaskValidator extends ClassValidatorFields<TaskProps> {
    validate(data: TaskProps): boolean {
        return super.validate(new TaskRules(data ?? ({} as TaskProps)));
    }
}

export class TaskValidatorFactory {
    static create(): TaskValidator {
        return new TaskValidator();
    }
}
