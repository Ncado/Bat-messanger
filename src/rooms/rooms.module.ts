import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomSchema,Room } from '../rooms/room.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/users/jwt-auth.guard';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from "@nestjs/jwt";
import { User,UserDocument } from 'src/users/user.schema';

@Module({
  providers: [RoomsService],
  controllers: [RoomsController],
  imports: [MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  UsersModule,
  
 // JwtModule
],
exports:[
  

  RoomsService
]
})
export class RoomsModule {}
