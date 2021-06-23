import axios from "axios";
import AuthRepository from "./AuthRepository";

const URL =
  process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:5001/coocal/asia-northeast1/api";

export default {
  getCode: async (): Promise<{ code: string }> => {
    const token = await AuthRepository.getToken();
    const response = await axios({
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: `${URL}/shared/code`,
    });
    return response.data;
  },
  generateCode: async (): Promise<{ code: string }> => {
    const token = await AuthRepository.getToken();
    const response = await axios({
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: `${URL}/shared/code`,
    });
    return response.data;
  },
  register: async (code: string): Promise<void> => {
    const token = await AuthRepository.getToken();
    await axios({
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: `${URL}/shared`,
      data: {
        code,
      },
    });
  },
};
