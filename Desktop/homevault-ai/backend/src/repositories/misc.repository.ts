import { prisma } from '../config/prisma';
import { ActivityAction, NotificationType } from '@prisma/client';

export const favoriteRepository = {
  add(userId: string, itemId: string) {
    return prisma.favorite.upsert({
      where: { userId_itemId: { userId, itemId } },
      update: {},
      create: { userId, itemId },
    });
  },
  remove(userId: string, itemId: string) {
    return prisma.favorite.deleteMany({ where: { userId, itemId } });
  },
  listForUser(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: { item: { include: { images: true, category: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },
};

export const activityLogRepository = {
  log(userId: string, action: ActivityAction, itemId?: string, metadata?: Record<string, unknown>) {
    return prisma.activityLog.create({ data: { userId, action, itemId, metadata: metadata as any } });
  },
  listForUser(userId: string, take = 50) {
    return prisma.activityLog.findMany({
      where: { userId },
      include: { item: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      take,
    });
  },
};

export const notificationRepository = {
  create(userId: string, type: NotificationType, title: string, message: string) {
    return prisma.notification.create({ data: { userId, type, title, message } });
  },
  listForUser(userId: string, unreadOnly = false) {
    return prisma.notification.findMany({
      where: { userId, ...(unreadOnly ? { isRead: false } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  },
  markRead(id: string, userId: string) {
    return prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
  },
  markAllRead(userId: string) {
    return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  },
};
