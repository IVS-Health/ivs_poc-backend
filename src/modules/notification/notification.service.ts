import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as admin from "firebase-admin";
import { Repository } from "typeorm";
import { Notification } from "./notification.entity";
import {
  NotificationDto,
  UpdateNotificationStatusDto,
} from "./dto/notification.dto";
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

    const emergencyCase = await this.emergencyCaseRepo.findOne({
      where: { id: dto.caseId },
    });

    const payload = {
      caseId: dto.caseId.toString(),
      type: (emergencyCase?.status || "UNKNOWN").toUpperCase(),
      Distance: "10",
    };

    const tokens = await this.tokenRepo.find({ relations: { user: true } });
    const fcmTargets = tokens
      .filter((t) => t.token) // remove null or empty tokens
      .map((t) => ({
        token: t.token,
        userId: t.user.id,
      }));

    if (!fcmTargets.length) throw new Error("No FCM tokens found");

    const results = await Promise.all(
      fcmTargets.map((target) =>
        admin
          .messaging()
          .send({
            token: target.token,
            notification: {
              title: "New Emergency Case Registered",
              body: "Distance: " + payload.Distance + " mins away",
            },
            data: {
              caseId: payload.caseId,
              distanceInMin: payload.Distance,
            },
          })
          .then((res) => ({
            token: target.token,
            success: true,
            res,
          }))
          .catch((err) => ({ token: target.token, success: false, err }))
      )
    );

    return results;
  }

  async updateNotificationStatusAndReturnCaseDetails(
    dto: UpdateNotificationStatusDto
  ) {
    const { caseId, notificationStatus } = dto;

    const emergencyCase = await this.emergencyCaseRepo.findOne({
      where: { id: caseId },
    });
    if (!emergencyCase) {
      throw new NotFoundException("Emergency case not found");
    } else if (emergencyCase.status === "assigned") {
      return {
        message: "assigned",
        case: emergencyCase,
      };
    } else if (emergencyCase.status === "cancelled") {
      return {
        message: "cancelled",
        case: emergencyCase,
      };
    } else if (emergencyCase.status === "completed") {
      return {
        message: "completed",
        case: emergencyCase,
      };
    } else {
      emergencyCase.status = "assigned";
      await this.emergencyCaseRepo.save(emergencyCase);
    }

    const notification = await this.notificationRepo.findOne({
      where: { case: { id: caseId } },
    });

    if (!notification) {
      throw new NotFoundException("Notification not found for the given case");
    }

    if (!emergencyCase) {
      throw new NotFoundException("Emergency case not found");
    }

    // update the status
    notification.status = notificationStatus;

    await this.notificationRepo.save(notification);

    return {
      message: "accepted",
      case: emergencyCase,
    };
  }
}
