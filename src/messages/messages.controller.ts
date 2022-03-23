import { Body, Headers ,Controller, Get, Param, Post, HttpException, HttpStatus, Put, Patch, UseGuards, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Messages } from './messages.schema';
import { CreateMessage } from './DTO/createMessage.dto';
import { DeleteMessage } from './DTO/DeleteMessage.dto';
import { EditMessage } from './DTO/editMessageText.dto';
import { GetMessages } from './DTO/getMessages.dto';

import { JwtAuthGuard } from 'src/users/jwt-auth.guard';
import { JwtService } from "@nestjs/jwt";


@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService,private jwtservice: JwtService) { }

    @UseGuards(JwtAuthGuard)
    @Put() //create
    async sendMessage(@Headers() token, @Body() createMessage: CreateMessage): Promise<Messages> {
        createMessage.ownerId = this.jwtservice.verify(token.authorization.split(' ')[1]).id
        return this.messagesService.createMessage(createMessage)
    }

    @UseGuards(JwtAuthGuard)
    @Delete() //delete
    async deleteMessage(@Headers() token, @Body() deleteMessage: DeleteMessage): Promise<Messages> {
        deleteMessage.ownerId = this.jwtservice.verify(token.authorization.split(' ')[1]).id

        return this.messagesService.deleteMessage(deleteMessage)
    }

    
    @UseGuards(JwtAuthGuard)
    @Patch("/edit")
    editMessageText(@Headers() token, @Body() editMessage: EditMessage) {
        editMessage.ownerId = this.jwtservice.verify(token.authorization.split(' ')[1]).id

        return this.messagesService.editMessageText(editMessage)
    }
    @Patch("/read")
    readMessage(@Headers() token, @Body() messageId): Promise<Messages> {

        return this.messagesService.readMessage(messageId.id)
    }
    @UseGuards(JwtAuthGuard)
    @Post()
    async getMessages(@Headers() token, @Body() getMessages: GetMessages) {
       // getMessages.userId = this.jwtservice.verify(token.authorization.split(' ')[1]).id

        return this.messagesService.getMessages(getMessages)
    }


    //will added in future
    // @Post() 
    // findMessage(){

    // }

}


