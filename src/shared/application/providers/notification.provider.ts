export interface NotificationProvider {
    sendDM(userId: string, message: string): Promise<void>;
    sendChannel(channelId: string, message: string): Promise<void>;
}