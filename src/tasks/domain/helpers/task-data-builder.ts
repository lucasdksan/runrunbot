import { faker } from "@faker-js/faker";
import { AssignmentsType, TaskProps } from "../entities/task.entity";

type Props = {
    task_tags?: string[];
    title?: string;
    board_stage_name?: string;
    assignments?: AssignmentsType[];
    description?: string;
    is_working_on?: boolean;
}

export function TaskDataBuilder(props: Props): TaskProps {
    return {
        title: props.title ?? faker.lorem.sentence(),
        task_tags: props.task_tags ?? faker.helpers.arrayElements(
            ["frontend", "backend", "bug", "urgent", "refactor"],
            faker.number.int({ min: 1, max: 3 })
        ),
        assignments: props.assignments ?? [
            {
                assignee_id: faker.string.uuid(),
                assignee_name: faker.person.fullName(),
                start_date: faker.date.recent().toISOString(),
            }
        ],
        board_stage_name: props.board_stage_name ?? faker.helpers.arrayElement([
            "To Do", "In Progress", "Code Review", "Done"
        ]),
        is_working_on: props.is_working_on ?? faker.datatype.boolean(),
        description: props.description ?? faker.lorem.paragraph()
    }
}