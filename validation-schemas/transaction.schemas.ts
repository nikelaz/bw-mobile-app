import { z } from 'zod';

export const CreateTransactionSchema = z.object({
  title: z.string()
    .min(1, { message: 'Title is required' }),
  date: z.string()
    .datetime({ message: 'Date is invalid'}),
  categoryBudgetId: z.string()
    .regex(/^\d+$/, { message: 'Category is invalid'})
    .transform(Number),
  amount: z.string()
    .min(1, { message: 'Amount is required' })
    .regex(/^(0|[1-9]\d*)(\.\d+)?$/, { message: 'Amount should be a decimal number (e.g. 123.50)'})
    .transform(Number),
});

export const UpdateTransactionSchema = z.object({
  id: z.number(),
  title: z.string()
    .min(1, { message: 'Title is required' }),
  amount: z.string()
    .min(1, { message: 'Amount is required' })
    .regex(/^(0|[1-9]\d*)(\.\d+)?$/, { message: 'Amount should be a decimal number (e.g. 123.50)'})
    .transform(Number),
});

