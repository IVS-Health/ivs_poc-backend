import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./modules/users/users.module";
import { EmergencyCaseModule } from "./modules/medicalCase/emergencyCase.module";
import { DatabaseModule } from "./database/database.module";
import { FirebaseModule } from "./firebase/firebase.module";
import { NotificationsModule } from "./modules/notification/notification.module";
import { TokenModule } from "./modules/token/token.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    EmergencyCaseModule,
    FirebaseModule,
    NotificationsModule,
    TokenModule,
  ],
})
export class AppModule {}
