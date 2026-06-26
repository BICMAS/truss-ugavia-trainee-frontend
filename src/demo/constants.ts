export const DEMO_ACCESS_TOKEN = "demo.truss-ugavi.local";
export const DEMO_REFRESH_TOKEN = "demo.truss-ugavi.refresh";

export const DEMO_CREDENTIALS = {
  email: "demo@trussugavi.site",
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

export interface DemoAccount {
  credentials: { email: string; phone?: string; password: string };
  user: {
    id: string;
    name: string;
    email: string;
    role: "Trainee";
    avatar: string;
  };
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { credentials: DEMO_CREDENTIALS, user: DEMO_USER },
  {
    credentials: {
      email: "azuka@trussugavi.site",
      password: "NewLe@rning$",
    },
    user: {
      id: "demo-user-002",
      name: "Azuka",
      email: "azuka@trussugavi.site",
      role: "Trainee",
      avatar:
        "https://api.dicebear.com/6.x/identicon/svg?seed=azuka-truss-ugavi",
    },
  },
];
