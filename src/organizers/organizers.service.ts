import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { OrganizersRepository } from './organizers.repository';
import { Organizer } from './dto/organizer.entity';
@Injectable()
export class OrganizersService {
    constructor(
        private organizersRepository: OrganizersRepository,
    ) { }

    async createOrganizer(createOrganizerDto: CreateOrganizerDto): Promise<Organizer | HttpException> {
        console.log('createOrganizerDto ', createOrganizerDto)
        if(!createOrganizerDto.name) {
            return new BadRequestException()
        } else {
            return await this.organizersRepository.save(createOrganizerDto);
        }
    }

    async getOrganizers(): Promise<Organizer[] | HttpException> {
        return await this.organizersRepository.find();
    }
    
    async getOrganizerId(id: string): Promise<Organizer | HttpException> {
        return await this.organizersRepository.findOne({
            where: { id }
        });
    }
}
