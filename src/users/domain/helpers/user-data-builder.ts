import { faker } from "@faker-js/faker";
import { UserProps } from "../entities/user.entity";

type Props = {
    discordUser?: string;
    runrunitUser?: string;
    createdAt?: Date;
}

export function UserDataBuilder(props: Props): UserProps {
    return {
        discordUser: props.discordUser ?? faker.person.firstName(),
        runrunitUser: props.runrunitUser ?? faker.internet.exampleEmail(),
        createdAt: props.createdAt ?? new Date()
    }
}