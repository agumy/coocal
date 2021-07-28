import { useMutation } from "react-query";
import { auth } from "../firebase";

export const useSignIn = () => {
  const mutation = useMutation(
    async ({ password, email }: { email: string; password: string }) => {
      return auth.signInWithEmailAndPassword(email, password);
    }
  );

  return mutation;
};
