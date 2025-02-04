import { z } from 'zod';

export const SignUpSchema = z.object({
  email: z.string()
    .email()
    .min(5, { message: 'Email must be 5 or more characters long' }),
  firstName:
    z.string()
    .min(1, { message: 'First name is required' }),
  lastName: z.string()
    .min(1, { message: 'Last name is required' }),
  password: z.string()
    .min(1, { message: 'Password is required' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message: 'Invalid Password. Use a password with at least 8 symbols, including letters and digits.'
    }),
  repeatPassword: z.string()
    .min(1, { message: 'The Repeat Password field is required' }),
  country: z.string()
    .min(1, { message: 'Country is required' }),
});

export const LoginSchema = z.object({
  email: z.string()
    .email({ message: 'Email is invalid' })
    .min(5, { message: 'Email must be 5 or more characters long' }),
  password: z.string()
    .min(1, { message: 'Password is required' })
});

export const ChangePasswordSchema = z.object({
  password: z.string()
    .min(1, { message: 'Password is required' }),
  newPassword: z.string()
    .min(1, { message: 'New Password is required' }),
  repeatPassword: z.string()
    .min(1, { message: 'Repeat Password is required' }),
});

export const UserUpdateSchema = z.object({
  firstName:
    z.string()
    .min(1, { message: 'First name is required' }),
  lastName: z.string()
    .min(1, { message: 'Last name is required' }),
});
