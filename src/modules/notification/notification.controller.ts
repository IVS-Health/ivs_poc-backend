import { Body, Controller, Get, Post, Put, Query } from "@nestjs/common";
import { NotificationsService } from "./notification.service";
import {
  NotificationDto,
  UpdateNotificationStatusDto,
} from "./dto/notification.dto";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async sendNotification(@Body() notificationDto: NotificationDto) {
    return this.notificationsService.sendNotification(notificationDto);
  }

  @Put()
  async updateNotificationStatus(@Body() dto: UpdateNotificationStatusDto) {
    return this.notificationsService.updateNotificationStatusAndReturnCaseDetails(
      dto
    );
  }
}
