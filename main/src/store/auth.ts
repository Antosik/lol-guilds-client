import Store from "electron-store";

import { isBlank, isNotExists } from "@guilds-shared/helpers/typeguards";


interface IAuthStorePrototype {
  summoner?: ILCUAPISummonerCoreResponse;
  token?: ILCUAPIIdToken;
}

export class AuthStore extends Store<IAuthStorePrototype> {
  constructor() {
    super({
      name: "auth",
      defaults: {
        summoner: undefined,
        token: undefined,
      }
    });
  }

  public static isTokenExpired(idToken?: ILCUAPIIdToken): boolean {
    if (isNotExists(idToken) || isBlank(idToken.token)) {
      return false;
    }
    return idToken.expiry * 1000 < Date.now();
  }

  public getToken(): ILCUAPIIdToken | undefined {
    return this.get("token");
  }

  public setToken(idToken: ILCUAPIIdToken): void {
    this.set(
      "token",
      { expiry: idToken.expiry, token: idToken.token } as ILCUAPIIdToken
    );
  }
}

export const authStore = new AuthStore();