import { Response, Request } from 'express';
import { OrganizersService } from './organizers.service';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
export declare class OrganizersController {
    private organizersService;
    constructor(organizersService: OrganizersService);
    showOrganizers(res: Response, req: Request): Promise<void>;
    showNewOrganizer(res: Response, req: Request): void;
    newOrganizer(res: Response, req: Request, createOrganizerDto: CreateOrganizerDto): Promise<void>;
    getOrganizer(res: Response, req: Request): Promise<void>;
    updateMyOrganization(res: Response, req: Request, createOrganizerDto: CreateOrganizerDto): Promise<void>;
    getEvent(res: Response, req: Request): Promise<void>;
}
