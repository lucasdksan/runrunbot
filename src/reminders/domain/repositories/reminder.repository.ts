import { SearchableRepositoryInterface, SearchParams as DefaultSearchParams, SearchResult as DefaultSearchResult } from "../../../shared/domain/repositories/searchable-repository-contracts";
import { ReminderEntity } from "../entities/reminder.entity";

export namespace ReminderRepository {
    export type Filter = string;

    export class SearchParams extends DefaultSearchParams<Filter> {};

    export class SearchResult extends DefaultSearchResult<ReminderEntity, Filter> {};

    export interface Repository extends SearchableRepositoryInterface<ReminderEntity, Filter, SearchParams, SearchResult> {
        findAllRemindersByUser(userId: string): Promise<ReminderEntity[]>; 
    };
}