import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { NotificationsService } from "./notification.service";
import { NotificationDto } from "./dto/notification.dto";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async sendNotification(@Body() notificationDto: NotificationDto) {
    return this.notificationsService.sendNotification(notificationDto);
  }
}
