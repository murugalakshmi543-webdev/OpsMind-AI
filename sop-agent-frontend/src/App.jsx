import { useState } from "react";
import UploadPanel from "./components/UploadPanel";
import ChatWindow from "./components/ChatWindow";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./styles.css";

export default function App() {
  const [page, setPage] = useState("register");

  return (
    <div className="app">
      <h1>OpsMind AI</h1>
      {page === "register" && (
        <Register onRegistered={() => setPage("login")} />
      )}

      {page === "login" && (
        <Login onLoginSuccess={() => setPage("chat")} />
      )}

      {page === "chat" && (
        <>
          <UploadPanel />
          <ChatWindow />
        </>
      )}
    </div>
  );
}
