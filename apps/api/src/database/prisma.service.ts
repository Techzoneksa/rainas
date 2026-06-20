import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const localDatabaseUrl =
  "postgresql://raina:raina_local_password@localhost:5432/raina_dev?schema=public";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      adapter: new PrismaPg(process.env.DATABASE_URL ?? localDatabaseUrl)
    });
  }

  async onModuleInit(): Promise<void> {
    if (process.env.NODE_ENV === "test" && process.env.DATABASE_URL === undefined) {
      this.logger.log("Database connection skipped for isolated tests.");
      return;
    }

    try {
      await this.$connect();
      this.logger.log("Database connection established.");
    } catch (error) {
      this.logger.error("Database connection failed.");
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  async isReady(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
