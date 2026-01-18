import { useState } from "react";
import { login } from "../services/auth";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    const ok = await login(email, password);
    if (ok) onLoginSuccess();
    else alert("Invalid credentials");
  }

  return (
    <div className="auth">
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={submit}>Login</button>
    </div>
  );
}
