import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as admin from "firebase-admin";
import { Repository } from "typeorm";
import { Notification } from "./notification.entity";
import { NotificationDto } from "./dto/notification.dto";
import { Token } from "../token/token.entity";
import { EmergencyCase } from "../medicalCase/emergencyCase.entity";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepo: Repository<Token>,
    @InjectRepository(EmergencyCase)
    private readonly emergencyCaseRepo: Repository<EmergencyCase>,
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>
  ) {}

  // Save notifications for all tokens
  async updateNotification(dto: NotificationDto) {
    const emergencyCase = await this.emergencyCaseRepo.findOne({
      where: { id: dto.caseId },
    });

    if (!emergencyCase) throw new Error("Emergency case not found");

    const tokens = await this.tokenRepo.find(); // fetch all tokens

    const notifications: Notification[] = []; // <-- type explicitly

    for (const token of tokens) {
      // Check if notification already exists for this token + case
      const exists = await this.notificationRepo.findOne({
        where: { case: { id: emergencyCase.id }, token: { id: token.id } },
      });

      if (!exists) {
        notifications.push(
          this.notificationRepo.create({ case: emergencyCase, token })
        );
      }
    }

    return this.notificationRepo.save(notifications);
  }

  async sendNotification(dto: NotificationDto) {
    await this.updateNotification(dto);

    const tokens = await this.tokenRepo.find();
    const fcmTokens = tokens.map((t) => t.token).filter(Boolean);

    if (!fcmTokens.length) throw new Error("No FCM tokens found");

    const results = await Promise.all(
      fcmTokens.map((token) =>
        admin
          .messaging()
          .send({
            token,
            notification: {
              title: "New Emergency Case",
              body: "This is a push notification.",
            },
          })
          .then((res) => ({ token, success: true, res }))
          .catch((err) => ({ token, success: false, err }))
      )
    );

    return results;
  }
}
