import { NotFoundError } from "../../../../../shared/domain/errors/not-found-error";
import { SqliteService } from "../../../../../shared/infrastructure/database/sqlite/database.service";
import { ReminderEntity } from "../../../../domain/entities/reminder.entity";
import { ReminderRepository } from "../../../../domain/repositories/reminder.repository";
import { ReminderModelMapper } from "../models/reminder-model.mapper";

export class ReminderSqliteRepository implements ReminderRepository.Repository {
    sortableFields: string[] = [];

    constructor(
        private sqliteService: SqliteService,
    ) { }

    async search(props: ReminderRepository.SearchParams): Promise<ReminderRepository.SearchResult> {
        throw new Error("Method not implemented.");
    }

    async findAll(): Promise<ReminderEntity[]> {
        const rows = await this.sqliteService.connection.all(`
            SELECT
            id,
            userId,
            message,
            remindAt,
            reminded,
            createdAt
            FROM reminders
        `);

        return rows.map((row: any) => new ReminderEntity({
            userId: row.userId,
            message: row.message,
            remindAt: new Date(row.remindAt),
            reminded: !!row.reminded,
            createdAt: new Date(row.createdAt),
        }, row.id));
    }

    async findAllRemindersByUser(userId: string): Promise<ReminderEntity[]> {
        const rows = await this.sqliteService.connection.all(
            `SELECT * FROM reminders WHERE userId = ?`,
            userId
        );

        return rows.map((row: any) => ReminderModelMapper.toEntity(row));
    }

    async insert(entity: ReminderEntity): Promise<void> {
        const {
            id,
            userId,
            message,
            remindAt,
            reminded,
            createdAt
        } = entity.toJSON();

        await this.sqliteService.connection.run(
            `INSERT INTO reminders (id, userId, message, remindAt, reminded, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
            id,
            userId,
            message,
            remindAt.toISOString(),
            reminded ? 1 : 0,
            createdAt?.toISOString()
        );
    }

    async findById(id: string): Promise<ReminderEntity> {
        const row = await this.sqliteService.connection.get(
            `SELECT * FROM reminders WHERE id = ?`,
            id
        );

        if (!row) {
            throw new NotFoundError(`Reminder not found using ID ${id}`);
        }

        return ReminderModelMapper.toEntity(row);
    }

    async update(entity: ReminderEntity): Promise<void> {
        await this._get(entity.id);

        const { id, userId, message, remindAt, reminded, createdAt } = entity.toJSON();

        await this.sqliteService.connection.run(
            `
            UPDATE reminders
            SET userId = ?, message = ?, remindAt = ?, reminded = ?, createdAt = ?
            WHERE id = ?
        `,
            userId,
            message,
            remindAt.toISOString(),
            reminded ? 1 : 0,
            createdAt?.toISOString(),
            id
        );
    }

    async delete(id: string): Promise<void> {
        await this._get(id);

        await this.sqliteService.connection.run(
            `DELETE FROM reminders WHERE id = ?`,
            id
        );
    }

    protected async _get(id: string): Promise<ReminderEntity> {
        try {
            const row = await this.sqliteService.connection.get(
                `SELECT * FROM reminders WHERE id = ?`,
                id
            );

            if (!row) {
                throw new NotFoundError(`Reminder not found using ID ${id}`);
            }

            return new ReminderEntity({
                userId: row.userId,
                message: row.message,
                remindAt: new Date(row.remindAt),
                reminded: !!row.reminded,
                createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
            }, row.id);
        } catch (error) {
            throw new NotFoundError(`Reminder not found using ID ${id}`);
        }
    }
}