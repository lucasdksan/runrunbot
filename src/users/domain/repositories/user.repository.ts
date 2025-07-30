import { SearchableRepositoryInterface, SearchParams as DefaultSearchParams, SearchResult as DefaultSearchResult } from "../../../shared/domain/repositories/searchable-repository-contracts";
import { UserEntity } from "../entities/user.entity";

export namespace UserRepository {
    export type Filter = string;

    export class SearchParams extends DefaultSearchParams<Filter> {};

    export class SearchResult extends DefaultSearchResult<UserEntity, Filter> {};

    export interface Repository extends SearchableRepositoryInterface<UserEntity, Filter, SearchParams, SearchResult> {
        findByDiscordUser(discordUser: string): Promise<UserEntity>;
        findByRunrunitUser(runrunitUser: string): Promise<UserEntity>;
    };
}