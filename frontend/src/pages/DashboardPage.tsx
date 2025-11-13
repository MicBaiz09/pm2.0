import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/Layout/AppShell";
import ServerList from "@/components/ServerList";
import ProcessTable from "@/components/ProcessTable";
import { useServers } from "@/hooks/useServers";
import { useProcesses } from "@/hooks/useProcesses";

const DashboardPage = () => {
  const [selectedServer, setSelectedServer] = useState<string>();
  const navigate = useNavigate();
  const servers = useServers();
  const processes = useProcesses(selectedServer);

  const sidebar = useMemo(
    () => (
      <ServerList
        servers={servers.list.data ?? []}
        active={selectedServer}
        onSelect={setSelectedServer}
        onNew={() => navigate("/servers")}
      />
    ),
    [servers.list.data, selectedServer, navigate]
  );

  return (
    <AppShell sidebar={sidebar}>
      <h1>Processes</h1>
      {selectedServer ? (
        <ProcessTable
          processes={processes.list.data ?? []}
          onStart={(id) => processes.start.mutate(id)}
          onStop={(id) => processes.stop.mutate(id)}
          onRestart={(id) => processes.restart.mutate(id)}
          onView={(id) => navigate(`/servers/${selectedServer}/processes/${id}`)}
        />
      ) : (
        <p>Select a server to view bot processes.</p>
      )}
    </AppShell>
  );
};

export default DashboardPage;
