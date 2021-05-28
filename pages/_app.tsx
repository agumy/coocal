import { AppProps } from "next/app";
import "tailwindcss/tailwind.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="h-screen w-screen flex flex-col text-gray-600">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
