import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from "./dto/auth-credentials.dto";
import { UserRole } from "./constants/user-role.constant";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async createUser(authCredentialDto: CreateUserDto, currentUser: User): Promise<User | HttpException> {
        const salt = await bcrypt.genSalt();
        const username = authCredentialDto.username;
        const firstName = authCredentialDto.firstName;
        const lastName = authCredentialDto.lastName;
        const organizerId = authCredentialDto.organizerId;
        const role = authCredentialDto.role;

        if (!this.validateAssignedRole(role, currentUser)){
            throw new BadRequestException('Assigned role is invalid');
        }
        const hashedPassword = await bcrypt.hash(
            authCredentialDto.password, salt
        )

        const user = this.create({
            username,
            password: hashedPassword,
            firstName,
            lastName,
            organizerId,
            role
        });

        try {
            return await this.save(user);
        } catch (error) {
            if (error.code === '23505') {
                //duplicate user
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async findUserById(id: string): Promise<User> {
        return await this.findOne({ where: { id } });
    }

    private validateAssignedRole(assignedRole: string, currentUser: User): boolean {
        switch (assignedRole) {
            case UserRole.ADMIN:
                if (currentUser.role !== UserRole.ADMIN) {
                    return false;
                } else {
                    return true;
                }

            case UserRole.ORGANIZER_ADMIN:
                if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.ORGANIZER_ADMIN) {
                    return false;
                } else {
                    return true;
                }

            default:
                return true;
        }
    }
}