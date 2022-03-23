import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document,Types, Schema as MongooseSchema } from 'mongoose';

export type RoomDocument = Room & Document;

@Schema()
export class Room {
  //dateTime: any = new Date()

 

  @Prop()
  title : string;

  @Prop()
  joinLink: string;

  @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'users'})
  primAdmin : MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
  secAdmin : MongooseSchema.Types.ObjectId[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users',any: Array})
  participants : MongooseSchema.Types.ObjectId;


  @Prop()
  private:boolean
}

export const RoomSchema = SchemaFactory.createForClass(Room);