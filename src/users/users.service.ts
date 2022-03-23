import { Injectable ,HttpException,HttpStatus} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './DTO/create-user.dto';
import { banUserDto } from './DTO/ban-user.dto';
import { User } from './user.schema';
import {Model} from "mongoose"
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

		constructor(private readonly usersRepository: UserRepository){}

		async createUser(email:string, password: string):Promise<User> {
			//  const user = this.UserRepository.create(dto)
				return  this.usersRepository.create({
					email,
					password
			})
		}
		async getAllUsers(){
			
				const users = await this.usersRepository.findAll({});
				return users
		 
		}
		async getUserbyEmail(value:string){
			const users = await this.usersRepository.findOne({"email":value});
			return users
		}
		async getUserById(value:string):Promise<User>{
			const users = await this.usersRepository.findOne({"_id":value});
			return users
		}
		async banUser(BanUserDto:banUserDto):Promise<User>{
			
			const userBan = await this.usersRepository.addBan(BanUserDto);
			return userBan
	 
	    }
	    async login( createUserDTO: CreateUserDto):Promise<object>{
			return await this.usersRepository.login(createUserDTO)
    	}
	
	    async registration(registerUserDTO: CreateUserDto):Promise<object>{
            const registerUser = await this.usersRepository.register(registerUserDTO)
            return registerUser
	    }

	
 
}
