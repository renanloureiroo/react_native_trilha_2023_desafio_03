import axios, { AxiosError, AxiosInstance } from "axios";

import { config } from "@config";
import { storage, AppError } from "@utils";

type Creadentials = {
  access_token: string;
  refresh_token: string;
};

export type RequestError = AxiosError<{
  message: string;
}>;

class Api {
  readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: config.baseURL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.response.use(
      (response) => response,
      (error: RequestError) => {
        __DEV__ &&
          console.tron.display({
            name: "Axios",
            preview: error.response?.status,
            value: error.response?.data ?? "Error",
            importante: true,
          });
        if (error.response && error.response.data) {
          return Promise.reject(new AppError(error.response.data.message));
        }

        return Promise.reject(error);
      }
    );

    storage
      .get<string>("access_token")
      .then(
        (token) =>
          (this.instance.defaults.headers.common = {
            Authorization: `Bearer ${token}`,
          })
      )
      .catch((err) => __DEV__ && console.log(err));
  }

  public async updateCredentials(credentials: Creadentials) {
    try {
      await storage.save("access_token", credentials.access_token);
      await storage.save("refres_token", credentials.refresh_token);

      this.instance.defaults.headers.common = {
        Authorization: `Bearer ${credentials.access_token}`,
      };
    } catch (error) {
      throw error;
    }
  }
}

export const api = new Api();
