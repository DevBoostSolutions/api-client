export interface Result<T = any> {
  statusCode: number;
  message: string;
  error?: ErrorResponse;
  data?: T;
}

export interface ErrorResponse {
  errorCode: string;
  message: string;
  details: string[];
}

export type User = {
  id: number;
  name: string;
  email: string;
  age: number;
};

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: Category;
};

export type Order = {
  id: number;
  user: User;
  products: Product[];
};

export type UserToken = {
  accessToken: string;
  refreshToken: string;
};
