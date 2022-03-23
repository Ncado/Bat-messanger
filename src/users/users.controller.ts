import { Body, Controller, Get, Param, Post,HttpException,HttpStatus, Put, Patch, UseGuards } from '@nestjs/common';
import { banUserDto } from './DTO/ban-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import {User} from './user.schema'
import {UsersService} from "./users.service"

class createUserDto{ //i so sory for that, i should create separete file for that
    email:string;
    password: string;
    
}
@Controller('user/')
export class UserController {

    constructor(private readonly UserService: UsersService){}

        // @Get(':id')
        // async getUser(@Param("id") transId:string):Promise<User>{
        //     return this.UserService.getUserById(transId);
        // }

    @Post()
    async createUser(@Body() createUser: createUserDto):Promise<User>{
        return this.UserService.createUser(createUser.email,createUser.password)
    }
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAllUsers():Promise<User[]>{

       
        return this.UserService.getAllUsers()
    
    }
    @Get("email/:email")
    async getOneUser( @Param('email') email: string):Promise<User>{
        return this.UserService.getUserbyEmail(email)
    }
    @Get("id/:userId")
    async findUser(@Param('userId') userId: string):Promise<User>{
        return this.UserService.getUserById(userId)
    }
    @Patch()
    async  banUser( @Body() BanUserDto:banUserDto):Promise<createUserDto> {
        return this.UserService.banUser(BanUserDto)
    }

    @Post("/login")
    async login(@Body() createUserDTO: createUserDto):Promise<object>{
       return this.UserService.login(createUserDTO)
  
    }
    @Post("/register")
    async register(@Body() registerUserDTO: createUserDto):Promise<object>{
        return this.UserService.registration(registerUserDTO)
      
    }
    // @Post()
    // async updateUser(@Param("id") transId:string, @Body() updateUser: UpdateUser): Promise<User>{
    //     return this.
    // }

    // @Get("/:test/:SS")
    // async test(@Param('test') test: string, @Param('SS')SS: string){
    //     return test + SS
    // }
}
