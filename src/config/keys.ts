interface Key {
  MONGO_URI: string;
  JWT_SECRET_KEY: string;
}

const KEYS: Key = {
  MONGO_URI:
    'mongodb+srv://Mach1nka:8055448@cluster0.6o3tr.mongodb.net/trello-clone?retryWrites=true&w=majority',
  JWT_SECRET_KEY: 'my-secret-key',
};

export default KEYS;
