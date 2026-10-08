export interface IUserLogin {
  email: string;
  password: string;
}
export interface IUserRegistration {
  name: string;
  email: string;
  password: string;
}

export interface IEmailVerification {
  email: string;
  otp: string;
}