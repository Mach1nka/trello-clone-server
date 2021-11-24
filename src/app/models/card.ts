import mongoose, { Schema } from 'mongoose';

interface CardAttrs {
  columnId: string;
  name: string;
  description: string;
  position: number;
}

export interface CardInDB extends mongoose.Document {
  columnId: string;
  name: string;
  description: string;
  position: number;
}

interface CardModel extends mongoose.Model<CardInDB> {
  build(attrs: CardAttrs): CardInDB;
}

const CardSchema = new Schema({
  columnId: {
    ref: 'columns',
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  position: {
    type: Number,
    required: true,
  },
});

CardSchema.statics.build = (attrs: CardModel) => new Card(attrs);

const Card = mongoose.model<CardInDB, CardModel>('cards', CardSchema);

export default Card;
