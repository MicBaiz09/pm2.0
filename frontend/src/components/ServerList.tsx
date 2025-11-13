import { Server } from "@/types";
import clsx from "clsx";
import "./ServerList.css";

interface Props {
  servers: Server[];
  active?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}

const ServerList = ({ servers, active, onSelect, onNew }: Props) => {
  return (
    <div className="server-list">
      <div className="server-list-header">
        <h2>Servers</h2>
        <button onClick={onNew}>+</button>
      </div>
      <ul>
        {servers.map((server) => (
          <li
            key={server.id}
            className={clsx({ active: server.id === active })}
            onClick={() => onSelect(server.id)}
          >
            <div className="name">{server.name}</div>
            <div className="host">{server.host}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServerList;
