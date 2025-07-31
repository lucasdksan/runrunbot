import { Entity } from "../../../shared/domain/entity/entity";
import { EntityValidationError } from "../../../shared/domain/errors/validation-error";
import { TaskValidatorFactory } from "../validators/task.validator";

type AssignmentsType = {
    assignee_id: string;
    assignee_name: string;	
    start_date: string;
    board_stage_name: string;
};

export type TaskProps = {
    task_tags: string[];
    title: string;
    assignments: AssignmentsType[];
    description?: string;
};

export class TaskEntity extends Entity<TaskProps> {
    constructor(public readonly props: TaskProps, id?: string) {
        TaskEntity.validate(props);
        super(props, id);
    }

    private set task_tags(value: string[]) {
        this.props.task_tags = value;
    }

    private set title(value: string){
        this.props.title = value;
    }

    private set assignments(value: AssignmentsType[]) {
        this.props.assignments = value;
    }

    private set description(value: string) {
        this.props.description = value;
    }

    get task_tags() {
        return this.props.task_tags;
    }

    get title(){
        return this.props.title;
    }

    get assignments() {
        return this.props.assignments;
    }

    get description() {
        return this.props.description ?? "";
    }

    static validate(props: TaskProps) {
        const validator = TaskValidatorFactory.create();
        const isValid = validator.validate(props);

        if (!isValid) {
            throw new EntityValidationError(validator.errors ? validator.errors : {});
        }
    }
}