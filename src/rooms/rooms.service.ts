import { Injectable, HttpException, HttpStatus, UnauthorizedException, RequestTimeoutException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Room, RoomSchema, RoomDocument } from '../rooms/room.schema';
import { User, UserSchema, UserDocument } from "src/users/user.schema";
import * as bcrypt from 'bcryptjs'
import { Model, FilterQuery } from 'mongoose'
import { MongooseModule } from '@nestjs/mongoose'
import { CreateRoom } from "./DTO/room.dto";
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { addSecAdmin } from "./DTO/addSecAdmin.dto";
import { deleteRoom } from "./DTO/deleteRoom.dto";
import { generateInviteLink } from "./DTO/generateInviteLink.dto";
import { UserRepository } from "src/users/user.repository";
import { PassThrough } from "stream";

const Hashids = require('hashids/cjs')

@Injectable()
export class RoomsService {
	constructor(@InjectModel(Room.name) private RoomModel: Model<RoomDocument>,
	private userRepository: UserRepository
	) { }


	async getAllpublicRooms(): Promise<Room[]> {
		return await this.RoomModel.find({ "private": false })
	}

	async createRoom(room: CreateRoom): Promise<Room> {
		//room.primAdmin = new MongooseSchema.Types.ObjectId(room.primAdmin)
		const uerID = room.primAdmin
		room.primAdmin = new Types.ObjectId(uerID)
		const newRoom = await new this.RoomModel(room);
		this.userRepository.addRoomToUser(newRoom._id,room.primAdmin)
		return await newRoom.save()
	}
	//user must be participant
	async addSecAdmin(addsecadmin: addSecAdmin): Promise<Room> {
		const thisRoom = await this.RoomModel.findById(addsecadmin.room)
		if (thisRoom.primAdmin == addsecadmin.primAdmin) {
			return await this.RoomModel.findByIdAndUpdate(addsecadmin.room, { $push: { 'secAdmin': new Types.ObjectId(addsecadmin.secAdmin), } })
		}
		throw new HttpException({
			status: HttpStatus.FORBIDDEN,
			error: 'you are mot primary admin af this chat',
		}, HttpStatus.FORBIDDEN);
	}


	async DeleteRoom(deleteroom: deleteRoom): Promise<Room> {
		const thisRoom = await this.RoomModel.findById(deleteroom.room)
		if (thisRoom.primAdmin == deleteroom.primAdmin) {
			this.userRepository.removeRoomFromAllUsers(deleteroom.room)
			return await this.RoomModel.findByIdAndDelete(deleteroom.room)
		}
		throw new HttpException({
			status: HttpStatus.FORBIDDEN,
			error: 'you are mot primary admin af this chat',
		}, HttpStatus.FORBIDDEN);
	}


	private getRandomInt(min, max): number {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	async generateInviteLink(generateInviteLink: generateInviteLink):Promise<Room> {
		const thisRoom = await this.RoomModel.findById(generateInviteLink.room)
		if (thisRoom.primAdmin == generateInviteLink.primAdmin) {
			let massSYMbol: string | string[] = []
			let symbols: string | string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+=-_+=-_0987654321!@#$%^&*!@#$%^&*!@#$%^&*!@#$%^&*+=-_+=-_'
			symbols = symbols.split("")

			for (let i = 0; i < 20; i++) {
				massSYMbol[i] = symbols[this.getRandomInt(0, 72)]
			}
			return await this.RoomModel.findByIdAndUpdate(generateInviteLink.room, { $set: { 'joinLink': "http://localhost:7000/rooms/join/" + massSYMbol.join('') } })
			
		}

		throw new HttpException({
			status: HttpStatus.FORBIDDEN,
			error: 'you are mot primary admin af this chat',
		}, HttpStatus.FORBIDDEN);
	}



	//how can i optimise this? 3 request to DB it's to much
	//сurRoom don't return array with participants
	async joinViaLink(joincode:string,strId:string){
		const curRoom:any = await this.RoomModel.findOne({"joinLink":"http://localhost:7000/rooms/"+joincode})
		const x = await this.RoomModel.findOne({"participants":{$in: new Types.ObjectId(strId)}})
		if(x){
			
			throw new HttpException({
				status: HttpStatus.FORBIDDEN,
				error: 'you already member of the room',
			}, HttpStatus.FORBIDDEN);
		}
		this.userRepository.addRoomToUser(curRoom._id,strId)
		return await this.RoomModel.findByIdAndUpdate(curRoom._id, { $push: { 'participants': new Types.ObjectId(strId) } })
	}


	async leaveRoom(roomId:string, userId:string){
		const curRoom:any = await this.RoomModel.findOne({"primAdmin":userId})
	//	return curRoom
		if(!curRoom){
			this.userRepository.removeRoomFromUser(roomId,userId)
			return await this.RoomModel.findByIdAndUpdate(roomId, { $pull: { 'participants': new Types.ObjectId(userId),"secAdmin": new Types.ObjectId(userId) } })

		}
		throw new HttpException({
			status: HttpStatus.FORBIDDEN,
			error: 'you primary admin of this room',
		}, HttpStatus.FORBIDDEN);
	}
	// async test(){
	// 	//return await this.UserModel.find()
	// 	return this.userRepository.test()
		
	// }


	async checkparticipant(userId:string,roomId:string){
	//	const xsa = await this.RoomModel.findOne({"participants":{$in:new Types.ObjectId(userId)},"_id": new Types.ObjectId(roomId),});
		const xa = await this.RoomModel.findOne({"participants":{$in:new Types.ObjectId(userId)}});
		
		
			return xa	
		
		return false
		return await this.RoomModel.find({ "private": false })
	}
}