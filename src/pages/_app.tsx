import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { UserContextProvider } from "../context/UserContext";
import { BrowserView, MobileView } from "react-device-detect";

import "tailwindcss/tailwind.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "../styles/style.css";

import { Header } from "../components/Header";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <BrowserView>
          <div className="h-screen w-screen flex flex-col text-gray-600 bg-blue-100">
            <Header />
            <Component {...pageProps} />
          </div>
        </BrowserView>
        <MobileView>
          <Component {...pageProps} />
        </MobileView>
        <ReactQueryDevtools initialIsOpen={false} />
      </UserContextProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
