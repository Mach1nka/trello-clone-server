import User, { UserInDB } from '../models/user';

interface SearchUser {
  id: string;
  login: string;
}

async function getUsersService(
  searchValue: string,
  userId: string
): Promise<SearchUser[]> {
  const regex = new RegExp(searchValue);
  const allUsers: UserInDB[] = await User.find({
    login: { $regex: regex, $options: 'i' },
  });

  const filteredUsers: UserInDB[] = allUsers.filter(
    (el) => el._id.toString() !== userId.toString()
  );

  const preparedData: SearchUser[] = filteredUsers.map((el) => ({
    id: String(el._id),
    login: el.login,
  }));

  return preparedData;
}

export default getUsersService;
