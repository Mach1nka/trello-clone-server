import mongoose, { Schema } from 'mongoose';

interface UserAttrs {
  login: string;
  password: string;
}

export interface UserInDB extends mongoose.Document {
  login: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserInDB> {
  build(attrs: UserAttrs): UserInDB;
}

const UserSchema = new Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.statics.build = (attrs: UserModel) => new User(attrs);

const User = mongoose.model<UserInDB, UserModel>('users', UserSchema);

export default User;
