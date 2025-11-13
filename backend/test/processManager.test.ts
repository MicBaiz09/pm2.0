import { ProcessManager } from "@/services/processManager";

describe("ProcessManager", () => {
  it("registers and lists processes", async () => {
    const manager = new ProcessManager();
    const config = {
      id: "test",
      name: "Test",
      command: "node -v",
      cwd: process.cwd(),
      env: {},
      instances: 1,
      autoRestart: false
    };
    await manager.start(config);
    const list = manager.list();
    expect(list).toHaveLength(1);
    await manager.stop("test");
  }, 15000);
});
