import axios from "axios";
import AuthRepository from "./AuthRepository";

const URL =
  process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:5001/coocal/us-central1/api";

export default {
  getCode: async () => {},
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
};
