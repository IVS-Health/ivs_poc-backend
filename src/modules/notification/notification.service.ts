import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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

    if (!emergencyCase) {
      throw new NotFoundException("Emergency case not found");
    }

    const tokens = await this.tokenRepo.find(); // fetch all tokens

    const existingNotifications = await this.notificationRepo.find({
      where: { case: { id: emergencyCase.id } },
      relations: { token: true },
    });

    const existingTokenIds = new Set(
      existingNotifications.map((n) => n.token.id)
    );

    const notifications = tokens
      .filter((token) => !existingTokenIds.has(token.id))
      .map((token) =>
        this.notificationRepo.create({
          case: emergencyCase,
          token,
          status: "sent",
        })
      );

    const saved = notifications.length
      ? await this.notificationRepo.save(notifications)
      : [];

    return {
      message: saved.length
        ? "Notifications created successfully"
        : "Notifications already exist for this case",
      created: saved.length,
      skipped: tokens.length - saved.length,
    };
  }

  async sendNotification(dto: NotificationDto) {
    await this.updateNotification(dto);

    const emergencyCase = await this.emergencyCaseRepo.findOne({
      where: { id: dto.caseId },
    });

    if (!emergencyCase) {
      throw new NotFoundException("Emergency case not found");
    }

    if (["assigned", "cancelled", "completed"].includes(emergencyCase.status)) {
      throw new ConflictException({
        message: emergencyCase.status,
      });
    }

    // Create missing notifications
    await this.updateNotification(dto);

    const notifications = await this.notificationRepo.find({
      where: { case: { id: dto.caseId } },
      relations: { token: { user: true } },
    });

    const fcmTargets = notifications
      .map((n) => n.token)
      .filter((t) => t?.token);

    if (!fcmTargets.length) {
      throw new NotFoundException("No FCM tokens found");
    }

    await this.notificationRepo.manager.transaction(async (manager) => {
      emergencyCase.status = "notified";
      await manager.save(emergencyCase);

      notifications.forEach((n) => (n.status = "sent"));
      await manager.save(notifications);
    });

    const payload = {
      caseId: dto.caseId.toString(),
      type: emergencyCase.status.toUpperCase(),
      Distance: "10",
    };

    const results = await Promise.all(
      fcmTargets.map((target) =>
        admin
          .messaging()
          .send({
            token: target.token,
            notification: {
              title: "New Emergency Case Registered",
              body: `Distance: ${payload.Distance} mins away`,
            },
            data: {
              caseId: payload.caseId,
              distanceInMin: payload.Distance,
              type: payload.type,
            },
          })
          .then((res) => ({
            token: target.token,
            success: true,
            res,
          }))
          .catch((err) => ({
            token: target.token,
            success: false,
            err,
          }))
      )
    );

    return {
      message: "Notifications sent successfully",
      caseStatus: emergencyCase.status,
      results,
    };
  }

  async updateNotificationStatusAndReturnCaseDetails(
    dto: UpdateNotificationStatusDto
  ) {
    const { caseId, notificationStatus, tokenId } = dto;

    const emergencyCase = await this.emergencyCaseRepo.findOne({
      where: { id: caseId },
    });

    if (!emergencyCase) {
      throw new NotFoundException("Emergency case not found");
    }

    if (["assigned", "cancelled", "completed"].includes(emergencyCase.status)) {
      throw new ConflictException({
        message: emergencyCase.status,
      });
    }

    const notification = await this.notificationRepo.findOne({
      where: {
        case: { id: caseId },
        token: { id: tokenId },
      },
    });

    if (!notification) {
      throw new NotFoundException("Notification not found");
    }

    await this.notificationRepo.manager.transaction(async (manager) => {
      if (notificationStatus === "accepted") {
        emergencyCase.status = "assigned";
        await manager.save(emergencyCase);
      }

      notification.status = notificationStatus;
      await manager.save(notification);
    });

    return {
      message: notificationStatus,
      case: emergencyCase,
    };
  }

  async cancelNotificationsByCaseId(caseId: number) {
    const notifications = await this.notificationRepo.find({
      where: { case: { id: caseId } },
    });

    if (!notifications.length) return;

    // Use a transaction to safely update all notifications
    await this.notificationRepo.manager.transaction(async (manager) => {
      notifications.forEach((n) => (n.status = "cancelled"));
      await manager.save(notifications);
    });
  }
}
