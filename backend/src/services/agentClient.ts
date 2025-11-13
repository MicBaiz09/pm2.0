import fetch from "node-fetch";
import { logger } from "@/config/logger";

export class AgentClient {
  constructor(
    private readonly agentUrl: string,
    private readonly token: string
  ) {}

  private headers() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`
    };
  }

  async request(path: string, init?: RequestInit) {
    const res = await fetch(`${this.agentUrl}${path}`, {
      ...init,
      headers: { ...this.headers(), ...(init?.headers ?? {}) }
    });
    if (!res.ok) {
      const body = await res.text();
      logger.error({ status: res.status, body }, "Agent error");
      throw new Error(`Agent request failed: ${res.status}`);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  startProcess(processId: string) {
    return this.request(`/processes/${processId}/start`, { method: "POST" });
  }
  stopProcess(processId: string) {
    return this.request(`/processes/${processId}/stop`, { method: "POST" });
  }
  restartProcess(processId: string) {
    return this.request(`/processes/${processId}/restart`, { method: "POST" });
  }
  deleteProcess(processId: string) {
    return this.request(`/processes/${processId}`, { method: "DELETE" });
  }
  fetchStatus() {
    return this.request("/status", { method: "GET" });
  }
}
