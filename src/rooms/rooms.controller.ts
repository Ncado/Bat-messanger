import {Headers , Body, Controller, Get, Param, Post,HttpException,HttpStatus, Put, Patch, UseGuards, Delete } from '@nestjs/common';
import { CreateRoom } from '../rooms/DTO/room.dto';
import { RoomsService } from './rooms.service';
import { Room } from '../rooms/room.schema';
import { JwtAuthGuard } from 'src/users/jwt-auth.guard';
import { JwtService } from "@nestjs/jwt";
import { Document,Types, Schema as MongooseSchema } from 'mongoose';
import { addSecAdmin } from './DTO/addSecAdmin.dto';
import { deleteRoom } from './DTO/deleteRoom.dto';
import { generateInviteLink } from './DTO/generateInviteLink.dto';


@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService,private jwtservice: JwtService) { }

    @Get() //get all public rooms
    async getAllpublicRooms(): Promise<Room[]> {
        return await this.roomsService.getAllpublicRooms()
    }

    @UseGuards(JwtAuthGuard)
    @Put() //create room
    async createRoom(@Headers() token, @Body() createRoom: CreateRoom): Promise<Room> {
       // const req = context.switchToHttp().getRequest()
        const strId:string =  this.jwtservice.verify(token.authorization.split(' ')[1]).id
        //createRoom.primAdmin = new MongooseSchema.Types.ObjectId(strId)
        createRoom.primAdmin = strId
        //createRoom.participants ={prim:strId}
        return await this.roomsService.createRoom(createRoom)
    }

    @UseGuards(JwtAuthGuard)
    @Patch() //add secadmin
    async addSecAdmin(@Headers() token, @Body() secAdmin: addSecAdmin): Promise<Room> {
        secAdmin.primAdmin = this.jwtservice.verify(token.authorization.split(' ')[1]).id
        return await this.roomsService.addSecAdmin(secAdmin)
    }


    @UseGuards(JwtAuthGuard)
    @Delete() //delete room
    async deleteRoom(@Headers() token, @Body() deleteroom: deleteRoom): Promise<Room> {
        const strId:string =  this.jwtservice.verify(token.authorization.split(' ')[1]).id
        deleteroom.primAdmin = strId
        return await this.roomsService.DeleteRoom(deleteroom)
    }


    @UseGuards(JwtAuthGuard)
    @Post("/join/:joincode")
    async joinViaLink(@Headers() token,@Param() params){
        const strId:string =  this.jwtservice.verify(token.authorization.split(' ')[1]).id
        return await this.roomsService.joinViaLink(params.joincode, strId)
    }


    @UseGuards(JwtAuthGuard)
    @Post("/join")
    async generateInviteLink(@Headers() token,@Body() generateInviteLink:generateInviteLink){
        const strId:string =  this.jwtservice.verify(token.authorization.split(' ')[1]).id
        generateInviteLink.primAdmin = strId

        return await this.roomsService.generateInviteLink(generateInviteLink)
    }


    @UseGuards(JwtAuthGuard)
    @Post("leave/")
    async leaveRoom(@Headers() token,@Body() room){
        const strId:string =  this.jwtservice.verify(token.authorization.split(' ')[1]).id
        
        return await this.roomsService.leaveRoom(room.room, strId)
    }

    //  @Get("/test")
    // async test(){
    //     return this.roomsService.test();
    // }
}
