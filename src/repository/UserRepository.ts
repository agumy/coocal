import { User } from "../models/User";
import { fetch } from "./fetch";

export default {
  get: async () => {},
  create: async (param: {
    name: string;
    birthday: string;
    gender: User["gender"];
  }): Promise<User> => {
    const response = await fetch({
      method: "POST",
      resource: `user`,
      data: {
        ...param,
      },
    });
    return response.data;
  },
};
