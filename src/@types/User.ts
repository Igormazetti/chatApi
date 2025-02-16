export interface User {
  id: number;
  username: string;
  password: string;
  created_at: Date;
}

export type UserCreationResponse = Pick<User, 'id'>;
export type UserWithoutPassword = Omit<User, 'password'>;
