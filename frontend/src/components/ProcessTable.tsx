import { BotProcess } from "@/types";
import "./ProcessTable.css";

interface Props {
  processes: BotProcess[];
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onRestart: (id: string) => void;
  onView: (id: string) => void;
}

const ProcessTable = ({ processes, onStart, onStop, onRestart, onView }: Props) => {
  return (
    <table className="process-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Instances</th>
          <th>Restarts</th>
          <th>Last Started</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {processes.map((proc) => (
          <tr key={proc.id}>
            <td>{proc.name}</td>
            <td>
              <span className={`status status-${proc.status.toLowerCase()}`}>{proc.status}</span>
            </td>
            <td>{proc.instances}</td>
            <td>{proc.restartCount}</td>
            <td>{proc.lastStartedAt ? new Date(proc.lastStartedAt).toLocaleString() : "—"}</td>
            <td>
              <div className="row-actions">
                <button onClick={() => onView(proc.id)}>Logs</button>
                <button onClick={() => onStart(proc.id)}>Start</button>
                <button onClick={() => onStop(proc.id)}>Stop</button>
                <button onClick={() => onRestart(proc.id)}>Restart</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProcessTable;
