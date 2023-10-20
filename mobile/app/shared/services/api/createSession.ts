import { AxiosResponse } from "axios";
import { RequestError, api } from "./api";

export interface ICreateSessionParams {
  email: string;
  password: string;
}

export interface ICreateSessionReponse {
  token: string;
  refresh_token: string;
  user: {
    id: string;
    avatar?: string;
    name: string;
    email: string;
    tel: string;
  };
}

function createSession<T = ICreateSessionReponse>(
  params: ICreateSessionParams
): Promise<AxiosResponse<T, RequestError>> {
  return api.instance.post<T>("/sessions", { ...params });
}

export { createSession };
