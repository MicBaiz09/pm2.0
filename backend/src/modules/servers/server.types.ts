import { z } from "zod";

export const ServerSchema = z.object({
  name: z.string().min(2),
  host: z.string().min(2),
  description: z.string().optional(),
  agentUrl: z.string().url(),
  agentToken: z.string().min(10),
  isLocal: z.boolean().optional()
});

export type ServerInput = z.infer<typeof ServerSchema>;
