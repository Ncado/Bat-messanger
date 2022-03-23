import { Injectable, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Messages, MessagesDocument,MessagesSchema } from './messages.schema';
import { Room, RoomSchema, RoomDocument } from '../rooms/room.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'
import { Model, FilterQuery } from 'mongoose'
import { MongooseModule } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { UserRepository } from "src/users/user.repository";
import { RoomsService } from "src/rooms/rooms.service";

import { CreateMessage } from './DTO/createMessage.dto';
import { DeleteMessage } from './DTO/DeleteMessage.dto';
import { EditMessage } from './DTO/editMessageText.dto';
import { GetMessages } from './DTO/getMessages.dto';

@Injectable()
export class MessagesService {
    constructor(@InjectModel(Messages.name) private MessageModel: Model<MessagesDocument>,
    private userService: UserRepository) {}

      async createMessage(createMessage: CreateMessage): Promise<Messages> {
       createMessage.ownerId = new Types.ObjectId(createMessage.ownerId)
       createMessage.roomId = new Types.ObjectId(createMessage.roomId)
        const newMessage = await new this.MessageModel(createMessage);
        return await newMessage.save()
      }
  


      async deleteMessage(deleteMessage: DeleteMessage): Promise<Messages> {
        const message = await this.MessageModel.findById(new Types.ObjectId(deleteMessage._id))
       
        if(deleteMessage.ownerId == deleteMessage.ownerId ){
          return await this.MessageModel.findByIdAndDelete(new Types.ObjectId(deleteMessage._id))
        }
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'you can\'t ',
        }, HttpStatus.FORBIDDEN);
      }   



      async getMessages(getMessages: GetMessages) {
        const curUser = await this.userService.getOneUser(getMessages.userId, getMessages.roomId)
        
        if(curUser[0]._id == getMessages.userId){
          return await this.MessageModel.find({ "roomId": getMessages.roomId }).limit(3).skip(getMessages.offset)
        }
        //const message = await this.MessageModel.findById(new Types.ObjectId(getMessages.userId))
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'you can\'t ',
        }, HttpStatus.FORBIDDEN);
        
				
      }


      async editMessageText(editMessage: EditMessage) {
        const message = await this.MessageModel.findById(new Types.ObjectId(editMessage._id))
       
        if(message.ownerId == editMessage.ownerId){
          return await this.MessageModel.findByIdAndUpdate(new Types.ObjectId(editMessage._id), { $set: { 'text': editMessage.text } })
        }
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'you can\'t ',
        }, HttpStatus.FORBIDDEN);
      }

      
      async readMessage(messageId: string | Types.ObjectId): Promise<Messages> {
        
        messageId = new Types.ObjectId(messageId)
        return await this.MessageModel.findByIdAndUpdate(messageId, { $set: { 'read': true } })
        
      }
     
}

