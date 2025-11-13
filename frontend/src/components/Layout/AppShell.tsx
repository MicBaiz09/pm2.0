import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import "./AppShell.css";

const AppShell = ({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) => {
  const { logout, user } = useAuth();
  return (
    <div className="shell">
      <aside className="shell-sidebar">{sidebar}</aside>
      <main className="shell-main">
        <header className="shell-header">
          <div className="shell-title">Bot Process Manager</div>
          <div className="shell-user">
            <span>{user?.email}</span>
            <button onClick={logout}>Logout</button>
          </div>
        </header>
        <div className="shell-content">{children}</div>
      </main>
    </div>
  );
};

export default AppShell;
