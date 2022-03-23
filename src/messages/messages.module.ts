import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesSchema, Messages } from './messages.schema';
import { UsersModule } from 'src/users/users.module';
import { RoomsModule } from 'src/rooms/rooms.module';


@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [MongooseModule.forFeature([{ name: Messages.name, schema: MessagesSchema }])
  ,UsersModule,
  RoomsModule],
  exports:[
    
  
    MessagesService
  ]
})
export class MessagesModule {}
