import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document,Types, Schema as MongooseSchema } from 'mongoose';

export type MessagesDocument = Messages & Document;

@Schema()
export class Messages {
  //dateTime: any = new Date()
  @Prop({ type: MongooseSchema.Types.ObjectId })
  ownerId: MongooseSchema.Types.ObjectId


  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'rooms' })
  roomId: MongooseSchema.Types.ObjectId

  

  @Prop({ required: true , default: new Date()})
  date: Date;

  @Prop()
  text : string;

  @Prop()
  image: string[];

  
  @Prop()
  file: string[];

  @Prop( {default:false})
  read: boolean;;
}

export const MessagesSchema = SchemaFactory.createForClass(Messages);