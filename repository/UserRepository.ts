import axios from "axios";
import { User } from "../models/User";
import AuthRepository from "./AuthRepository";

const URL =
  process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:5001/coocal/asia-northeast1/api";

export default {
  get: async () => {},
  create: async (param: {
    name: string;
    birthday: string;
    gender: User["gender"];
  }): Promise<User> => {
    const token = await AuthRepository.getToken();
    const response = await axios({
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: `${URL}/user`,
      data: {
        ...param,
      },
    });
    return response.data;
  },
};
