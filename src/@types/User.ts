export interface User {
  id: number;
  username: string;
  password: string;
  created_at: Date;
}

export type UserCreationResponse = Omit<User, 'password'>;
export type UserForTest = Pick<User, 'id' | 'username'> &
  Partial<Omit<User, 'id' | 'username'>>;
