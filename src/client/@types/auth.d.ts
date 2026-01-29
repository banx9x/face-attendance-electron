type LoginPayload = {
  username: string;
  password: string;
};

type User = {
  id: string;
  email: string;
};

type LoginResponse = {
  token: string;
  accountInfo: User;
};

type AuthState = {
  token: string | null;
  user: User | null;
};
