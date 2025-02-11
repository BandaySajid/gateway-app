import { z } from 'zod';

const ExpressionSchema = z.object({
  id: z.number(),
  type: z.string(),
  operator: z.string(),
  value: z.union([
    z.object({
      key: z.string().optional(),
      value: z.any().optional()
    }),
    z.string()
  ]).optional(),
  logic: z.string().nullable()
});

function isValidIpOrHost(str: string): { pass: boolean, type: 'host' | 'ip' } {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

  const hostnameRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
  const ipTest = ipv4Regex.test(str) || ipv6Regex.test(str);
  const hostTest = hostnameRegex.test(str);

  return { pass: ipTest || hostTest, type: ipTest ? 'ip' : "host" };
}

const HostDataSchema = z.object({
  name: z.string().min(1, { message: "Name must be a non-empty string." }).max(100, { message: "Name must be 100 characters or less." }),
  host: z.string().min(1, { message: "Host must be a non-empty string." }).max(100, { message: "Host must be 100 characters or less." }),
  period: z.number().gt(0, { message: "Period must be a number greater than zero." }).max(604800, { message: "Period must be less than or equal to 604800 seconds (7 days)." }),
  duration: z.number().gt(0, { message: "Duration must be a number greater than zero." }).max(604800, { message: "Duration must be less than or equal to 604800 seconds (7 days)." }),
  frequency: z.number().gt(0, { message: "Frequency must be a number greater than zero." }).max(10000, { message: "Frequency must be less than or equal to 10000." }),
  port: z.string().max(5, { message: "Port must be 5 characters or less." }).optional().nullable(),
  protocol: z.enum(['http', 'https'], {
    errorMap: () => ({ message: "Protocol must be either 'http' or 'https'." }),
  }),
  filter: z.enum(['all', 'custom'], {
    errorMap: () => ({ message: "Filter must be either 'all' or 'custom'." }),
  }),
  expressions: z.array(ExpressionSchema).max(10, { message: "Maximum of 10 expressions allowed." }).optional(),
}).transform((data) => {
  if (!data.expressions || data.expressions.length === 0) {
    return { ...data, filter: 'all' };
  }
  return data;
}).refine((data) => {
  if (data.filter === 'custom' && (!data.expressions || data.expressions.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Expressions must be a non-empty array when filter is 'custom'.",
  path: ["expressions"],
}).refine((data) => {
  const hostCheck = isValidIpOrHost(data.host);
  if (hostCheck.type === 'ip' && !data.port) {
    return false;
  }
  return true;
}, {
  message: "Port is required when host is an IP address.",
  path: ["port"],
}).refine((data) => {
  const hostCheck = isValidIpOrHost(data.host);
  if (hostCheck.type === 'host' && data.port) {
    return false;
  }
  return true;
}, {
  message: "Port should not be provided when host is a hostname.",
  path: ["port"],
});

export type HostData = z.infer<typeof HostDataSchema>;

export function validateHostData(data: any): string | null {
  try {
    HostDataSchema.parse(data);
    return null;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.log('error', error.issues)
      return error.errors[0].message;
    }
    return "Validation failed: " + error.message;
  }
}