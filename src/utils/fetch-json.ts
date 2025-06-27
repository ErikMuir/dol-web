import { StandardPayload } from "./api-responses";

export interface MyRequestInit extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
}

export const fetchStandardJson = async <T>(
  url: string,
  init: MyRequestInit = {}
): Promise<T> => {
  const response = await fetchJson<StandardPayload<T>>(url, init);
  if (!response.ok) throw new Error(response.error);
  return response.data;
};

export const fetchJson = async <T>(
  url: string,
  init: MyRequestInit = {}
): Promise<T> => {
  init.headers = {
    ...(init.headers || {}),
    "x-api-key": `${process.env.NEXT_PUBLIC_API_TOKEN}`,
  };
  return fetch(url, init).then((res) => res.json());
};
