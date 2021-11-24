import mongoose, { Schema } from 'mongoose';

interface BoardAttrs {
  name: string;
  owner: string;
  accessUsers?: string[];
}

export interface BoardInDB extends mongoose.Document {
  name: string;
  owner: string;
  accessUsers: string[];
}

interface BoardModel extends mongoose.Model<BoardInDB> {
  build(attrs: BoardAttrs): BoardInDB;
}

const BoardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner: { ref: 'users', type: Schema.Types.ObjectId, required: true },
  accessUsers: [{ ref: 'users', type: Schema.Types.ObjectId, default: [] }],
});

BoardSchema.statics.build = (attrs: BoardModel) => new Board(attrs);

const Board = mongoose.model<BoardInDB, BoardModel>('boards', BoardSchema);

export default Board;
