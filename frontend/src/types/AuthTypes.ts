export interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export type SignupFormKeys = keyof SignupForm;
export type LoginFormKeys = keyof LoginForm;
