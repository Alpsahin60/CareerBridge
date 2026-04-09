import { env } from "@/lib/env";

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, opts: { status: number; payload?: unknown }) {
    super(message);
    this.status = opts.status;
    this.payload = opts.payload;
  }
}

async function parseJsonSafely(res: Response) {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export async function apiFetch<T>(
  path: string,
  opts?: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string;
  }
): Promise<T> {
  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    method: opts?.method ?? "GET",
    headers: {
      "content-type": "application/json",
      ...(opts?.token ? { authorization: `Bearer ${opts.token}` } : {}),
    },
    body: opts?.body ? JSON.stringify(opts.body) : undefined,
  });

  const payload = await parseJsonSafely(res);
  if (!res.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? (payload as { message?: unknown }).message
        : undefined;
    const msg =
      typeof message === "string"
        ? message
        : `API error (${res.status})`;
    throw new ApiError(msg, { status: res.status, payload });
  }
  return payload as T;
}

