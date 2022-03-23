import { Injectable } from "@nestjs/common";


@Injectable()
export class AppService{
    getUsers(){
         return [{id:333, name: "Ncadoooo"}]
    }
}

