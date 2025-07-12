// Use relative URLs for API endpoints

interface SignupParams {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface LoginParams {
  email: string;
  password: string;
}

export async function signup({
  email,
  password,
  firstName,
  lastName,
}: SignupParams) {
  const res = await fetch(`/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, firstName, lastName }),
    credentials: "include",
  });
  const data = await res.json();
  return data;
}

export async function login({ email, password }: LoginParams) {
  const res = await fetch(`/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  const data = await res.json();
  return data;
}

export async function getProfile() {
  const res = await fetch(`/api/protected/profile`, {
    credentials: "include",
  });
  return res.json();
}

export async function logout() {
  await fetch(`/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
