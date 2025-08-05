import { Entity } from "../../../shared/domain/entity/entity";
import { EntityValidationError } from "../../../shared/domain/errors/validation-error";
import { TaskValidatorFactory } from "../validators/task.validator";
import { textFormatterUtil } from "./utils/text-formatter.util";

export type AssignmentsType = {
    assignee_id: string;
    assignee_name: string;
    start_date?: string;
};

export type TaskProps = {
    task_tags: string[];
    title: string;
    board_stage_name: string;
    is_working_on: boolean;
    assignments: AssignmentsType[];
    description?: string;
};

export class TaskEntity extends Entity<TaskProps> {
    constructor(public readonly props: TaskProps, id?: string) {
        TaskEntity.validate(props);
        super(props, id);
    }

    private set board_stage_name(value: string) {
        this.props.board_stage_name = value;
    }

    private set task_tags(value: string[]) {
        this.props.task_tags = value;
    }

    private set title(value: string) {
        this.props.title = value;
    }

    private set assignments(value: AssignmentsType[]) {
        this.props.assignments = value;
    }

    private set description(value: string) {
        this.props.description = value;
    }

    private set is_working_on(value: boolean) {
        this.props.is_working_on = value;
    }

    get task_tags() {
        return this.props.task_tags;
    }

    get title() {
        return this.props.title;
    }

    get assignments() {
        return this.props.assignments;
    }

    get description() {
        return this.props.description ?? "";
    }

    get board_stage_name() {
        return this.props.board_stage_name;
    }

    get is_working_on() {
        return this.props.is_working_on;
    }

    public formatDescription() {
        if (!this.description) return "";

        return textFormatterUtil(this.description);
    }

    static publicFormatText(value: string){
        return textFormatterUtil(value);
    }

    static validate(props: TaskProps) {
        const validator = TaskValidatorFactory.create();
        const isValid = validator.validate(props);

        if (!isValid) {
            throw new EntityValidationError(validator.errors ? validator.errors : {});
        }
    }

    static getQuotationBoardTasks(tasks: any[]) {
        return tasks.filter((task) => task.board_id === 544220);
    }

    static taskOngoing(runrunitUser: string, tasks: any[]) {
        return tasks.filter((task) => {
            const stageMatch =
                task.board_stage_name === "Ongoing"

            const assigneeMatch = task.assignments?.some(
                (assignment) => assignment.assignee_id === runrunitUser
            );

            return stageMatch && assigneeMatch && task.is_working_on;
        });
    }

    static filterTasks(runrunitUser: string, tasks: any[]) {
        return tasks.filter((task) => {
            const stageMatch =
                task.board_stage_name === "Ongoing" ||
                task.board_stage_name === "Task" ||
                task.board_stage_name === "Ready for Production";

            const assigneeMatch = task.assignments?.some(
                (assignment) => assignment.assignee_id === runrunitUser
            );

            return stageMatch && assigneeMatch;
        });
    }
}