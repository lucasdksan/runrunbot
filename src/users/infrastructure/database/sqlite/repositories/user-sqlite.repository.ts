import { NotFoundError } from "../../../../../shared/domain/errors/not-found-error";
import { SqliteService } from "../../../../../shared/infrastructure/database/sqlite/database.service";
import { UserEntity } from "../../../../domain/entities/user.entity";
import { UserRepository } from "../../../../domain/repositories/user.repository";
import { UserModelMapper } from "../models/user-model.mapper";

export class UserSqliteRepository implements UserRepository.Repository {
    sortableFields: string[] = [];

    constructor(
        private sqliteService: SqliteService,
    ) { }

    async discordUserExist(discordUser: string): Promise<boolean> {
        const row = await this.sqliteService.connection.get(
            `SELECT * FROM users WHERE discordUser = ?`,
            discordUser
        );

        if (!row) return false;

        return true;
    }

    async runrunitUserExist(runrunitUser: string): Promise<boolean> {
        const row = await this.sqliteService.connection.get(
            `SELECT * FROM users WHERE runrunitUser = ?`,
            runrunitUser
        );

        if (!row) return false;

        return true;
    }

    async findByDiscordUser(discordUser: string): Promise<UserEntity> {
        const row = await this.sqliteService.connection.get(
            `SELECT * FROM users WHERE discordUser = ?`,
            discordUser
        );

        if (!row) throw new NotFoundError("User not found.");

        return UserModelMapper.toEntity(row);
    }

    async findByRunrunitUser(runrunitUser: string): Promise<UserEntity> {
        const row = await this.sqliteService.connection.get(
            `SELECT * FROM users WHERE runrunitUser = ?`,
            runrunitUser
        );

        if (!row) throw new NotFoundError("User not found.");

        return UserModelMapper.toEntity(row);
    }

    async insert(entity: UserEntity): Promise<void> {
        const { id, discordUser, runrunitUser, createdAt } = entity.toJSON();

        await this.sqliteService.connection.run(
            `INSERT INTO users (id, discordUser, runrunitUser, createdAt) VALUES (?, ?, ?, ?)`,
            id,
            discordUser,
            runrunitUser,
            createdAt?.toISOString()
        );
    }

    async update(entity: UserEntity): Promise<void> {
        await this._get(entity.id);

        const { id, discordUser, runrunitUser, createdAt } = entity.toJSON();

        await this.sqliteService.connection.run(`
            UPDATE users
            SET discordUser = ?, runrunitUser = ?, createdAt = ?
            WHERE id = ?
        `,
            discordUser,
            runrunitUser,
            createdAt?.toISOString(),
            id
        );
    }

    search(props: UserRepository.SearchParams): Promise<UserRepository.SearchResult> {
        throw new Error("Method not implemented.");
    }

    findById(id: string): Promise<UserEntity> {
        throw new Error("Method not implemented.");
    }

    findAll(): Promise<UserEntity[]> {
        throw new Error("Method not implemented.");
    }

    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    protected async _get(id: string): Promise<UserEntity> {
        try {
            const row = await this.sqliteService.connection.get(
                `SELECT * FROM users WHERE id = ?`,
                id
            );

            if (!row) {
                throw new NotFoundError(`UserModel not found using ID ${id}`);
            }

            return new UserEntity({
                discordUser: row.discordUser,
                runrunitUser: row.runrunitUser,
                createdAt: new Date(row.createdAt),
            }, row.id);
        } catch (error) {
            throw new NotFoundError(`UserModel not found using ID ${id}`);
        }
    }
}