export type UserRole = "ADMIN" | "VIEWER";

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface Server {
  id: string;
  name: string;
  host: string;
  description?: string;
  agentUrl: string;
  isLocal: boolean;
}

export interface BotProcess {
  id: string;
  serverId: string;
  name: string;
  command: string;
  cwd: string;
  env: { key: string; value: string }[];
  instances: number;
  autoRestart: boolean;
  status: "ONLINE" | "STOPPED" | "ERRORED" | "RESTARTING";
  restartCount: number;
  lastStartedAt?: string;
  lastStoppedAt?: string;
}
