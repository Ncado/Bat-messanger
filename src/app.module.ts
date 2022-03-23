 import { Module } from "@nestjs/common";
import { AppControler } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from "./users/users.module";
import { MessagesModule } from './messages/messages.module';
import { RoomsModule } from './rooms/rooms.module';

 @Module({
    controllers: [AppControler],
    providers:[AppService],
    imports:[
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        MongooseModule.forRoot( process.env.MONGO_URI ),
        UsersModule,
        MessagesModule,
        RoomsModule,
        
    ]
 })
export class AppModule {
      
}
