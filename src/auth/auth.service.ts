import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto, CreateUserDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './dto/jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository
    ) { }

    async findUserById(id: string): Promise<User> {
        return this.userRepository.findUserById(id);
    }

    async signUp(authCredentialDto: CreateUserDto): Promise<User | HttpException> {
        return await this.userRepository.createUser(authCredentialDto);

    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<Partial<User>> {
        const { username, password } = authCredentialsDto;
        const user = await this.userRepository.findOne({
            where: { username }
        });
        if (user && (await bcrypt.compare(password, user.password))) {
            // const payload: JwtPayload = { username };
            // const accessToken: string = this.jwtService.sign(payload);
            const { password, ...result } = user;
            return result;
        } else {
            return null;
        }
    }

    async updateUser(userDto: CreateUserDto): Promise<User> {
        const {password, ...user} = await this.userRepository.findOne({
            where: { username: userDto.username }
        });
        console.log(userDto)
        return this.userRepository.save({
            ...user,
            ...userDto
        });
    }
}
