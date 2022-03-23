import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema, UserDocument} from './user.schema';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
@Module({
  providers: [UsersService,UserRepository],
  controllers: [UserController],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  JwtModule.register({secret:process.env.PRIVATE_KEY||"NOT_SECRET",
  signOptions:{
    expiresIn: "2000h"
  }})],
  exports:[
    JwtModule,
    UserRepository
  ]

})
export class UsersModule {}
