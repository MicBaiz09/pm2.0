import { z } from "zod";

export const EnvVarSchema = z.array(
  z.object({
    key: z.string().min(1),
    value: z.string()
  })
);

export const ProcessCreateSchema = z.object({
  serverId: z.string(),
  name: z.string().min(2),
  command: z.string().min(2),
  cwd: z.string().min(1),
  env: EnvVarSchema.default([]),
  instances: z.number().int().min(1).max(10).default(1),
  autoRestart: z.boolean().default(true)
});

export const ProcessUpdateSchema = ProcessCreateSchema.partial();

export type ProcessCreateInput = z.infer<typeof ProcessCreateSchema>;
