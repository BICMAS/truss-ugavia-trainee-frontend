import {
  DEMO_ACCESS_TOKEN,
  DEMO_CREDENTIALS,
  DEMO_REFRESH_TOKEN,
  DEMO_USER,
} from "@/demo/constants";
import { getAccessToken } from "@/utils/auth";

export function isDemoSession(token?: string | null): boolean {
  const value = token ?? getAccessToken();
  return value === DEMO_ACCESS_TOKEN;
}

export function matchesDemoCredentials(
  mode: "EMAIL" | "PHONE",
  email: string,
  phone: string,
  password: string,
): boolean {
  if (password !== DEMO_CREDENTIALS.password) return false;

  if (mode === "EMAIL") {
    return email.trim().toLowerCase() === DEMO_CREDENTIALS.email;
  }

  const normalizedPhone = phone.replace(/\s/g, "");
  return (
    normalizedPhone === DEMO_CREDENTIALS.phone ||
    normalizedPhone === DEMO_CREDENTIALS.phone.replace("+", "")
  );
}

export function createDemoLoginResponse() {
  return {
    accessToken: DEMO_ACCESS_TOKEN,
    refreshToken: DEMO_REFRESH_TOKEN,
    user: {
      id: DEMO_USER.id,
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      role: DEMO_USER.role,
      phone: DEMO_CREDENTIALS.phone,
    },
  };
}

export function createDemoAuthPayload() {
  return {
    accessToken: DEMO_ACCESS_TOKEN,
    refreshToken: DEMO_REFRESH_TOKEN,
    user: DEMO_USER,
  };
}
