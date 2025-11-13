import { FormEvent, useState } from "react";
import AppShell from "@/components/Layout/AppShell";
import ServerList from "@/components/ServerList";
import { useServers } from "@/hooks/useServers";
import "./ServerSettingsPage.css";

const defaultForm = {
  name: "",
  host: "",
  description: "",
  agentUrl: "",
  agentToken: "",
  isLocal: false
};

const ServerSettingsPage = () => {
  const { list, create, update, remove } = useServers();
  const [selectedId, setSelectedId] = useState<string>();
  const [form, setForm] = useState(defaultForm);

  const servers = list.data ?? [];

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedId) {
      update.mutate({ id: selectedId, ...form });
    } else {
      create.mutate(form);
    }
    setForm(defaultForm);
    setSelectedId(undefined);
  };

  const onEdit = (id: string) => {
    const server = servers.find((s) => s.id === id);
    if (!server) return;
    setSelectedId(id);
    setForm({
      name: server.name,
      host: server.host,
      description: server.description ?? "",
      agentUrl: server.agentUrl,
      agentToken: "",
      isLocal: server.isLocal
    });
  };

  const sidebar = (
    <ServerList
      servers={servers}
      active={selectedId}
      onSelect={onEdit}
      onNew={() => {
        setSelectedId(undefined);
        setForm(defaultForm);
      }}
    />
  );

  return (
    <AppShell sidebar={sidebar}>
      <h1>Server Settings</h1>
      <form onSubmit={onSubmit} className="form">
        <label>Name</label>
        <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <label>Host</label>
        <input value={form.host} onChange={(e) => setForm((f) => ({ ...f, host: e.target.value }))} />
        <label>Description</label>
        <input
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
        <label>Agent URL</label>
        <input
          value={form.agentUrl}
          onChange={(e) => setForm((f) => ({ ...f, agentUrl: e.target.value }))}
        />
        <label>Agent Token</label>
        <input
          value={form.agentToken}
          onChange={(e) => setForm((f) => ({ ...f, agentToken: e.target.value }))}
        />
        <label>
          <input
            type="checkbox"
            checked={form.isLocal}
            onChange={(e) => setForm((f) => ({ ...f, isLocal: e.target.checked }))}
          />
          Local Server
        </label>
        <div className="form-actions">
          <button type="submit">{selectedId ? "Update Server" : "Create Server"}</button>
          {selectedId && (
            <button type="button" onClick={() => selectedId && remove.mutate(selectedId)}>
              Delete
            </button>
          )}
        </div>
      </form>
    </AppShell>
  );
};

export default ServerSettingsPage;
