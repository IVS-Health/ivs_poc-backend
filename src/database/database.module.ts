import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import databaseConfig from "../config/database.config";
import { User } from "../modules/users/user.entity";
import { EmergencyCase } from "../modules/medicalCase/emergencyCase.entity";

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("database.host"),
        port: configService.get<number>("database.port"),
        username: configService.get<string>("database.username"),
        password: configService.get<string>("database.password"),
        database: configService.get<string>("database.database"),
        entities: [User, EmergencyCase],
        synchronize: configService.get<boolean>("database.synchronize"),
      }),
    }),
  ],
})
export class DatabaseModule {}
