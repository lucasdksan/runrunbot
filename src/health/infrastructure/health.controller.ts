import { Controller, Get, Inject } from "@nestjs/common";
import { CheckHealth } from "../application/usecases/check-health.usecase";

@Controller("health")
export class HealthController {
  @Inject(CheckHealth.Usecase)
  private checkHealthUsecase: CheckHealth.Usecase;

  constructor() {}

  @Get("check")
  async checkSystem() {
    try {
      const result = await this.checkHealthUsecase.execute();
      
      return result;
    } catch (error) {
      return {
        status: "error",
        database: "disconnected",
        discord: "disconnected",
        timestamp: new Date().toISOString(),
      };
    }
  }
}
