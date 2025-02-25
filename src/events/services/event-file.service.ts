import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';

@Injectable()
export class EventFileService {
    private readonly uploadPath = './public/images/events';

    getEventUploadPath(eventId: string): string {
        const path = `${this.uploadPath}/${eventId}`;
        if (!existsSync(path)) {
            mkdirSync(path, { recursive: true });
        }
        return path;
    }

    generateFileName(originalname: string): string {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        return `${uniqueSuffix}${extname(originalname)}`;
    }

    getPublicUrl(eventId: string, filename: string): string {
        return `/images/events/${eventId}/${filename}`;
    }
}
