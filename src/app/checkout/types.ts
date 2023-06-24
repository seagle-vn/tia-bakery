import z from 'zod';

export const schema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  address: z.string(),
  city: z.string(),
  postal_code: z.string(),
  date: z.string(),
  notes: z.string(),
  whenToPay: z.string(),
  paymentMethod: z.string(),
});

export type FormValues = z.infer<typeof schema>;
