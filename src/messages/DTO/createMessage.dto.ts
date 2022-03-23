////import { Document,Types, Schema as MongooseSchema } from 'mongoose';

export class CreateMessage {
    _id?: any //string | MongooseSchema.Types.ObjectId;
    ownerId: any //string | MongooseSchema.Types.ObjectId;
    roomId: any //string | MongooseSchema.Types.ObjectId;
    text ?: string
    image ?: string;
    file ?: string
   

}