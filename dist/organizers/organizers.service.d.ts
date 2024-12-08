import { HttpException } from '@nestjs/common';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { OrganizersRepository } from './organizers.repository';
import { Organizer } from './dto/organizer.entity';
export declare class OrganizersService {
    private organizersRepository;
    constructor(organizersRepository: OrganizersRepository);
    createOrganizer(createOrganizerDto: CreateOrganizerDto): Promise<Organizer | HttpException>;
    getOrganizers(): Promise<Organizer[] | HttpException>;
    updateOrganizers(id: string, organizer: CreateOrganizerDto): Promise<Organizer>;
    getOrganizerId(id: string): Promise<Organizer | HttpException>;
}
