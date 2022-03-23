import { Document,Types, Schema as MongooseSchema } from 'mongoose';

export class CreateRoom {
    _id?: any //string | MongooseSchema.Types.ObjectId;
    title: string
    joinLink?: string
    primAdmin : any //string | MongooseSchema.Types.ObjectId;
    secAdmin ?: any //string | MongooseSchema.Types.ObjectId;
    participants: any //string | MongooseSchema.Types.ObjectId;
    private: boolean

}