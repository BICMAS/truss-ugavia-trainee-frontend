import {
  DEMO_ACCESS_TOKEN,
  DEMO_ACCOUNTS,
  DEMO_REFRESH_TOKEN,
  type DemoAccount,
} from "@/demo/constants";
import { getAccessToken } from "@/utils/auth";

export function isDemoSession(token?: string | null): boolean {
  const value = token ?? getAccessToken();
  return value === DEMO_ACCESS_TOKEN;
}

export function findDemoAccount(
  mode: "EMAIL" | "PHONE",
  email: string,
  phone: string,
  password: string,
): DemoAccount | null {
  const normalizedPhone = phone.replace(/\s/g, "");
  const normalizedEmail = email.trim().toLowerCase();

  const match = DEMO_ACCOUNTS.find((account) => {
    if (password !== account.credentials.password) return false;

    if (mode === "EMAIL") {
      return normalizedEmail === account.credentials.email.toLowerCase();
    }

    const accountPhone = account.credentials.phone;
    if (!accountPhone) return false;
    return (
      normalizedPhone === accountPhone ||
      normalizedPhone === accountPhone.replace("+", "")
    );
  });

  return match ?? null;
}

export function matchesDemoCredentials(
  mode: "EMAIL" | "PHONE",
  email: string,
  phone: string,
  password: string,
): boolean {
  return findDemoAccount(mode, email, phone, password) !== null;
}

export function createDemoLoginResponse(
  account: DemoAccount = DEMO_ACCOUNTS[0],
) {
  return {
    accessToken: DEMO_ACCESS_TOKEN,
    refreshToken: DEMO_REFRESH_TOKEN,
    user: {
      id: account.user.id,
      email: account.user.email,
      name: account.user.name,
      role: account.user.role,
      phone: account.credentials.phone,
    },
  };
}

export function createDemoAuthPayload(
  account: DemoAccount = DEMO_ACCOUNTS[0],
) {
  return {
    accessToken: DEMO_ACCESS_TOKEN,
    refreshToken: DEMO_REFRESH_TOKEN,
    user: account.user,
  };
}
