export type IUser = {
  name: string;
  email: string;
  password: string;
  image: string;
  phone: string;
  role: "ADMIN" | "USER";
  address: string;
};
export enum ENUM_ROLE {
  ADMIN = "ADMIN",
  USER = "USER",
}
