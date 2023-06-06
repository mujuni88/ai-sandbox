import { z } from 'zod';
import { TravelStyle } from './constants';

export const querySchema = z.object({
  destination: z
    .string({
      invalid_type_error: 'Destination must be a string',
    })
    .min(2)
    .max(100),
  lengthOfStay: z
    .number({
      invalid_type_error: 'Length of stay must be a number',
    })
    .int()
    .min(1)
    .max(30)
    .optional()
    .default(1),
  budget: z
    .number({
      invalid_type_error: 'Budget must be a number',
    })
    .int()
    .min(5)
    .max(10000)
    .optional()
    .default(100),
  travelStyle: z
    .enum(TravelStyle, {
      invalid_type_error:
        'Travel style must be one of the following: ' + TravelStyle.join(', '),
    })
    .optional()
    .default(TravelStyle[0]),
});

export type Query = z.infer<typeof querySchema>;
