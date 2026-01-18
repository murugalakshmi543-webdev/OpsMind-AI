import { useState } from "react";
import { register } from "../services/auth";

export default function Register({ onRegistered }) {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
  const ok = await register(company, email, password);
  if (ok) onRegistered();
}


  return (
    <div className="auth">
      <h2>Register Company</h2>

      <input placeholder="Company Name" value={company} onChange={e => setCompany(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
