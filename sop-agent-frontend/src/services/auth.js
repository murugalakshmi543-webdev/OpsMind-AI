const BASE = "http://localhost:3000/api/auth";

export async function register(company, email, password) {
  const res = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company, email, password })
  });

  if (!res.ok) {
    const data = await res.json();
    alert(data.message);
    return false;
  }

  return true;
}


export async function login(email, password) {
  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const data = await res.json();
    alert(data.message);
    return false;
  }

  return true;
}
