import bcrypt from 'bcryptjs';

import User, { UserInDB } from '../models/user';
import InvalidCredentials from '../../utils/errors/invalid-credentials';
import AlreadyExists from '../../utils/errors/already-exists';

interface AuthData {
  login: string;
  password: string;
}

async function loginService(reqBody: AuthData): Promise<UserInDB> {
  const { login, password } = reqBody;
  const user: UserInDB | null = await User.findOne({ login });

  if (!user) {
    throw new InvalidCredentials();
  }

  const isPasswordEqual = bcrypt.compareSync(password, user.password);

  if (!isPasswordEqual) {
    throw new InvalidCredentials();
  }

  return user;
}

async function registerService(reqBody: AuthData): Promise<UserInDB> {
  const { login, password } = reqBody;
  const candidate: UserInDB | null = await User.findOne({ login });

  if (candidate) {
    throw new AlreadyExists();
  }

  const salt = bcrypt.genSaltSync(10);
  const user = User.build({
    login,
    password: bcrypt.hashSync(password, salt),
  });

  const createdUser = await user.save();

  return createdUser;
}

export { loginService, registerService };
