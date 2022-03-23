import { Injectable, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserSchema, UserDocument } from './user.schema'
import { MongooseModule } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose'
import { CreateUserDto } from "./DTO/create-user.dto";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'
import { Document, Types, Schema as MongooseSchema } from 'mongoose';


@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>,
    private jwtService: JwtService) {

    }
    async findOne(userFilterQuery: FilterQuery<User>): Promise<User> {
        return this.UserModel.findOne(userFilterQuery)
    }

    async addBan(userFilterQuery: FilterQuery<User>): Promise<User> {
        return await this.UserModel.findByIdAndUpdate(userFilterQuery.id, {$set: {'banned': true,"banReason":userFilterQuery.banReason}})
    }

    public async findAll(userFilterQuery: FilterQuery<User>): Promise<User[]> {
      
            return this.UserModel.find(userFilterQuery)
        
    }

    public async create(user: CreateUserDto): Promise<User> {
   
            const newUser = new this.UserModel(user);
            return newUser.save()
     

    }
    async login( createUserDTO: CreateUserDto){
        const user = await this.UserModel.findOne(({"email":createUserDTO.email}))
        
        const passwordEquals = await bcrypt.compare(createUserDTO.password, user.password);
        if(user && passwordEquals){
            return await this.generateToken(user.email, user._id);
        }
 
        throw new UnauthorizedException({message: "incorrect enter data"})
        
      
    }


    // private async validateUser(validateUser: CreateUserDto):Promise<User>{

    //     const user = await this.UserModel.findOne(({"email":validateUser.email}))
    //     const passwordEquals = await bcrypt.compare(validateUser.password, user.password);
    //     if(user && passwordEquals){
    //         return user
    //     }
      
    //     throw new UnauthorizedException({message: "incorrect enter data"})
    // }




    async register(registerUserDTO: CreateUserDto):Promise<object>{

        
        const hashPassword = await bcrypt.hash(registerUserDTO.password,5)
        
        const user = new this.UserModel({...registerUserDTO, "password": hashPassword});
        const newUser = await user.save()
        const userId = await this.UserModel.findOne({"email":user.email})
        return await this.generateToken(user.email,userId._id)
    }
    async generateToken(email:string, id:string){
        

        const payload = {email: email, id: id}
        return{
            token: await this.jwtService.sign(payload)
        }
    }

    async addRoomToUser(roomId:string,userId:string){
        
        return await this.UserModel.findByIdAndUpdate(userId, { $push: { 'rooms': new Types.ObjectId(roomId)} })

    }
    async removeRoomFromUser(roomId:string,userId:string){
        
        return await this.UserModel.findByIdAndUpdate(userId, { $pull: { 'rooms': new Types.ObjectId(roomId)} })

    }
    async removeRoomFromAllUsers(roomId:string){
        
        return await this.UserModel.updateMany({ $pull: { 'rooms': new Types.ObjectId(roomId)} })

    }

    async getOneUser(idUser:string,roomId:string){
        
        return await this.UserModel.find({"_id":idUser,"rooms":{$in:roomId}})

    }
    // async findOneAndUpdate(userFilterQuery: FilterQuery<User>, user: Partial<User>) {
    //     return this.UserModel.findByIdAndUpdate(userFilterQuery, user);
    // }
    // async checkparticipant(userId:string,roomId:string){
    //     //	const xsa = await this.RoomModel.findOne({"participants":{$in:new Types.ObjectId(userId)},"_id": new Types.ObjectId(roomId),});
    //         const xa = await this.RoomModel.findOne({"participants":{$in:new Types.ObjectId(userId)}});
            
            
    //             return xa	
            
    //         return false
    //         return await this.RoomModel.find({ "private": false })
    //     }
}

