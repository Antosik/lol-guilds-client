import fetch from "node-fetch";


export interface IGuildsAPIRequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string | object | undefined;
  version?: 1 | 2;
}


export class GuildsAPI {
  private _token: string;

  constructor(token: string) {
    this._token = token;
  }

  public async request(path: string, options: IGuildsAPIRequestOptions): Promise<unknown> {
    const opts = { method: "GET", version: 1, body: undefined, ...options };

    const apiVersion = opts.version === 2 ? "api-v2" : "api";
    const body = typeof opts.body === "undefined" ? undefined : JSON.stringify(opts.body);

    return fetch(`https://clubs.lcu.ru.leagueoflegends.com/${apiVersion}/${path}`, {
      method: opts.method,
      body,
      headers: {
        "Accept": "application/json",
        "Authorization": `JWT ${this._token}`,
        "Content-Type": "application/json",
      }
    }).then(res => res.json());
  }
}

export const createGuildsApi = (token: string): GuildsAPI => new GuildsAPI(token);