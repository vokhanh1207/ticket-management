import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { CreateUserDto } from '../auth/dto/auth-credentials.dto';
import { OrganizersService } from '../organizers/organizers.service';
export declare class UsersService {
    private userRepository;
    private organizersService;
    constructor(userRepository: Repository<User>, organizersService: OrganizersService);
    getAllUsers(): Promise<User[]>;
    getUsersByOrganizerId(organizerId: string): Promise<User[]>;
    findUserById(id: string): Promise<User>;
    findUserWithOrganizerById(id: string): Promise<User & {
        organizerName?: string;
    }>;
    updateUser(userId: string, updateData: Partial<CreateUserDto>): Promise<User>;
    deleteUser(id: string): Promise<void>;
    getAllOrganizers(): Promise<import("@nestjs/common").HttpException | import("../organizers/dto/organizer.entity").Organizer[]>;
}
