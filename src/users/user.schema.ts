import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,Types, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true , unique: true})
  email: string;

  @Prop()
  password : string;

  @Prop({default:false})
  banned: boolean;

  
  @Prop()
  banReason: string;


  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'rooms', any: Array})
  rooms:  MongooseSchema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);