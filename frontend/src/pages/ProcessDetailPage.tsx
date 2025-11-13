import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "@/components/Layout/AppShell";
import ServerList from "@/components/ServerList";
import LogViewer from "@/components/LogViewer";
import { useServers } from "@/hooks/useServers";
import { useProcesses } from "@/hooks/useProcesses";
import { useSocket } from "@/hooks/useSocket";

const ProcessDetailPage = () => {
  const { serverId, processId } = useParams();
  const navigate = useNavigate();
  const servers = useServers();
  const processes = useProcesses(serverId);
  const socketRef = useSocket();

  const sidebar = useMemo(
    () => (
      <ServerList
        servers={servers.list.data ?? []}
        active={serverId}
        onSelect={(id) => navigate(`/servers/${id}/processes/${processId}`)}
        onNew={() => navigate("/servers")}
      />
    ),
    [servers.list.data, serverId, processId, navigate]
  );

  const process = (processes.list.data ?? []).find((p) => p.id === processId);

  return (
    <AppShell sidebar={sidebar}>
      <h1>{process?.name ?? "Process"}</h1>
      {process ? (
        <>
          <p>Status: {process.status}</p>
          <p>Command: {process.command}</p>
          <p>Working Dir: {process.cwd}</p>
          <p>Instances: {process.instances}</p>
          <LogViewer socketRef={socketRef} processId={process.id} />
        </>
      ) : (
        <p>Process not found.</p>
      )}
    </AppShell>
  );
};

export default ProcessDetailPage;
