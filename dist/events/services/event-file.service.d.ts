export declare class EventFileService {
    private readonly uploadPath;
    getEventUploadPath(eventId: string): string;
    generateFileName(originalname: string): string;
    getPublicUrl(eventId: string, filename: string): string;
}
