import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from "./dto/auth-credentials.dto";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async createUser(authCredentialDto: CreateUserDto): Promise<void> {
        const salt = await bcrypt.genSalt();
        const username = authCredentialDto.username;
        const firstName = authCredentialDto.firstName;
        const lastName = authCredentialDto.lastName;
        const hashedPassword = await bcrypt.hash(
            authCredentialDto.password, salt
        )

        const user = this.create({
            username,
            password: hashedPassword,
            firstName,
            lastName
        });

        try {
            await this.save(user);
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
}