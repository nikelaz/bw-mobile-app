import { z } from 'zod';

export const CreateCategoryBudgetSchema = z.object({
  title: z.string()
    .min(1, { message: 'Title is required' }),
  amount: z.string()
    .min(1, { message: 'Amount is required' })
    .regex(/^(0|[1-9]\d*)(\.\d+)?$/, { message: 'Amount should be a decimal number (e.g. 123.50)' }),
  accAmount: z.string()
    .regex(/^(0|[1-9]\d*)(\.\d+)?$/, { message: 'Amount should be a decimal number (e.g. 123.50)' })
    .optional()
    .or(z.literal(''))
});

