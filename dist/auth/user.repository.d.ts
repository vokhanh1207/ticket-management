import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { HttpException } from "@nestjs/common";
import { CreateUserDto } from "./dto/auth-credentials.dto";
export declare class UserRepository extends Repository<User> {
    private dataSource;
    constructor(dataSource: DataSource);
    createUser(authCredentialDto: CreateUserDto, currentUser: User): Promise<User | HttpException>;
    findUserById(id: string): Promise<User>;
    private validateAssignedRole;
}
