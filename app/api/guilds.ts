import type { IKeyValue } from "../interfaces/IKeyValue";

import fetch from "node-fetch";

interface IGuildsAPIRequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string | object | undefined;
  version?: 1 | 2;
  token?: string;
}

export async function requestGuildsAPI(path: string, options: IGuildsAPIRequestOptions = { method: "GET", version: 1 }) {
  const apiVersion = options.version === 2 ? "api-v2" : "api";
  const headers: IKeyValue = {
    "Accept": "application/json",
    "Content-Type": "application/json",
  };

  if (options.token) {
    headers.Authorization = `JWT ${options.token}`;
  }

  return fetch(`https://clubs.lcu.ru.leagueoflegends.com/${apiVersion}/${path}`, {
    method: options.method,
    body: typeof options.body === "undefined" ? undefined : JSON.stringify(options.body),
    headers
  }).then(res => res.json());
}

export const api = {
  getMe: async (token: string = "") => requestGuildsAPI("contest/summoner", { method: "GET", version: 2, token }),
  getGuildMembers: async (club_id: number, token: string = "") => requestGuildsAPI(`accounts/clubs/${club_id}/members`, { method: "GET", version: 2, token })
    .then((members: IKeyValue[]) =>
      members
        .map((member: IKeyValue) => ({
          name: member.summoner.summoner_name,
          role: member.role,
          status: "None"
        }))
        .sort(({ name: n1 }, { name: n2 }) => n1.localeCompare(n2))
    ),
  getCurrentSeason: async (token: string = "") => requestGuildsAPI("contest/season", { method: "GET", version: 2, token })
    .then((seasons: IKeyValue[]) => seasons.find((season: IKeyValue) => season.is_open && !season.is_closed))
};