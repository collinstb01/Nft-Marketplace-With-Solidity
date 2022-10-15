import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* <Header /> */}
      <MoralisProvider
        appId="I0XpcQBbymHEplzHTSyfbh5Jaxu7SZo6knM7u7rz"
        serverUrl="https://h2gwyqmirzrq.grandmoralis.com:2053/server"
      >
        <Component {...pageProps} />
      </MoralisProvider>
    </>
  );
}

export default MyApp;
