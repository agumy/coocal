import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserContextProvider } from "../context/UserContext";
import "tailwindcss/tailwind.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header } from "../components/Header";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <div className="h-screen w-screen flex flex-col text-gray-600 bg-blue-100">
          <Header />
          <Component {...pageProps} />
        </div>
      </UserContextProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
