export const DEMO_ACCESS_TOKEN = "demo.truss-ugavi.local";
export const DEMO_REFRESH_TOKEN = "demo.truss-ugavi.refresh";

export const DEMO_CREDENTIALS = {
  email: "demo@trussugavi.com",
  phone: "+255700000000",
  password: "demo1234",
} as const;

export const DEMO_USER = {
  id: "demo-user-001",
  name: "Demo Trainee",
  email: DEMO_CREDENTIALS.email,
  role: "Trainee" as const,
  avatar:
    "https://api.dicebear.com/6.x/identicon/svg?seed=demo-truss-ugavi",
};
