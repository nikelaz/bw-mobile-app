import { z } from 'zod';

const UserSchema = z.object({
  email: z.string()
    .email()
    .min(5, { message: 'Email must be 5 or more characters long' }),
  firstName:
    z.string()
    .min(2, {
      message: 'First name must be 2 or more characters long'
    }),
  lastName: z.string()
    .min(2, {
      message: 'Last name must be 2 or more characters long'
    }),
  password: z.string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message: 'Invalid Password. Use a password with at least 8 symbols, including letters and digits.'
    }),
  repeatPassword: z.string(),
  country: z.string(),
});

export default UserSchema;
