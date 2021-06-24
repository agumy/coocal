import axios, { AxiosRequestConfig } from "axios";
import { auth } from "../firebase";

const URL =
  process.env.NODE_ENV === "production"
    ? "https://asia-northeast1-coocal.cloudfunctions.net/api"
    : "http://localhost:5001/coocal/asia-northeast1/api";

export const fetch = async ({
  headers = {},
  resource,
  ...config
}: AxiosRequestConfig & { resource: string }) => {
  const token = await getToken();
  const response = await axios({
    ...config,
    headers: {
      authorization: `Bearer ${token}`,
      ...headers,
    },
    url: `${URL}/${resource}`,
  });
  return response;
};

export const getToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("ユーザーはログインしていません");
  }
  const token = await user.getIdToken(true);
  return token;
};
