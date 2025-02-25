import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { CreateUserDto } from '../auth/dto/auth-credentials.dto';
import { OrganizersService } from '../organizers/organizers.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private organizersService: OrganizersService
    ) {}

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find({
            order: { username: 'ASC' }
        });
    }

    async getUsersByOrganizerId(organizerId: string): Promise<User[]> {
        return this.userRepository.find({
            where: { organizerId },
            order: { username: 'ASC' }
        });
    }

    async findUserById(id: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }

    async findUserWithOrganizerById(id: string): Promise<User & { organizerName?: string }> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }

        if (user.organizerId) {
            const organizer = await this.organizersService.getOrganizerId(user.organizerId);
            return {
                ...user,
                organizerName: organizer?.name
            };
        }

        return user;
    }

    async updateUser(userId: string, updateData: Partial<CreateUserDto>): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: userId });
        return this.userRepository.save({
            ...user,
            ...updateData
        });
    }

    async deleteUser(id: string): Promise<void> {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
    }

    async getAllOrganizers() {
        return this.organizersService.getOrganizers();
    }
}
