import {
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested,
    ArrayNotEmpty,
    IsISO8601,
} from "class-validator";
import { Type } from "class-transformer";
import { ClassValidatorFields } from "../../../shared/domain/validators/class-validator-fields";
import { TaskProps } from "../entities/task.entity";

class AssignmentRules {
    @IsString()
    @IsNotEmpty()
    assignee_id: string;

    @IsString()
    @IsNotEmpty()
    assignee_name: string;

    @IsISO8601()
    @IsNotEmpty()
    start_date: string;

    @IsString()
    @IsNotEmpty()
    board_stage_name: string;

    constructor(props: AssignmentRules) {
        Object.assign(this, props);
    }
}

export class TaskRules {
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    task_tags: string[];

    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => AssignmentRules)
    assignments: AssignmentRules[];

    @IsOptional()
    @IsString()
    description?: string;

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
