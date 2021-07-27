import { useMutation } from "react-query";
import { auth } from "../firebase";

export const useCreateUser = () => {
  const mutation = useMutation(
    async ({ password, email }: { email: string; password: string }) => {
      return auth.createUserWithEmailAndPassword(email, password);
    },
    {
      onSuccess: async ({ user }) => {
        if (user) {
          const ACTION_CODE_SETTINGS = {
            url: `${window.location.origin}/sign-up/verified`,
            handleCodeInApp: true,
          };
          await user.sendEmailVerification(ACTION_CODE_SETTINGS);
        }
      },
    }
  );

  return mutation;
};
