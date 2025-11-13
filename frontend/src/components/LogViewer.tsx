import { useEffect, useState } from "react";
import "./LogViewer.css";

interface LogEntry {
  type: "stdout" | "stderr";
  message: string;
}

const LogViewer = ({ socketRef, processId }: { socketRef: any; processId: string }) => {
  const [lines, setLines] = useState<LogEntry[]>([]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handler = (payload: LogEntry) => {
      setLines((prev) => [...prev.slice(-1000), payload]);
    };

    socket.emit("subscribe:process", processId);
    socket.on("log", handler);

    return () => {
      socket.emit("unsubscribe:process", processId);
      socket.off("log", handler);
    };
  }, [socketRef, processId]);

  return (
    <div className="log-viewer">
      {lines.map((line, index) => (
        <pre key={index} className={line.type === "stderr" ? "stderr" : ""}>
          {line.message}
        </pre>
      ))}
    </div>
  );
};

export default LogViewer;
