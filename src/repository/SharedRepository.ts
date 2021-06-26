import { fetch } from "./fetch";

export default {
  getCode: async (): Promise<{ code: string }> => {
    const response = await fetch({
      method: "GET",
      resource: `shared/code`,
    });
    return response.data;
  },
  generateCode: async (): Promise<{ code: string }> => {
    const response = await fetch({
      method: "POST",
      resource: `shared/code`,
    });
    return response.data;
  },
  register: async (code: string): Promise<void> => {
    await fetch({
      method: "POST",
      resource: `shared`,
      data: {
        code,
      },
    });
  },
  getUser: async (): Promise<{ user: any }> => {
    const response = await fetch({
      method: "GET",
      resource: `shared/user`,
    });
    return response.data;
  },
};
