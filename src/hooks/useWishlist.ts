import { useQuery } from "react-query";
import { useUserContext } from "../context/UserContext";
import MenuRepository from "../repository/MenuRepository";

export const useWishlist = () => {
  const { user } = useUserContext();

  const query = useQuery([], () => MenuRepository.get(), {
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!user?.uid,
  });

  return query;
};
