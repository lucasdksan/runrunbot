import { Module } from "@nestjs/common";
import { EnvConfigModule } from "../env-config/env-config.module";
import { IAService } from "./ia.service";

@Module({
    imports: [EnvConfigModule],
    providers: [IAService],
    exports: [IAService]
})
export class IAModule {};