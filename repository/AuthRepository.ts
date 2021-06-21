import { auth } from "../firebase";

export default {
  getToken: async () => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("ユーザーはログインしていません");
    }
    const token = await user.getIdToken(true);
    return token;
  },
};
