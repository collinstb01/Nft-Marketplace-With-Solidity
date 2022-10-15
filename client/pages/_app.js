import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import { NotificationProvider } from "web3uikit";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="NFT Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider appId="jjj" serverUrl="jj">
        <NotificationProvider>
          <Header />
          <Component {...pageProps} />
        </NotificationProvider>
      </MoralisProvider>
    </div>
  );
}

export default MyApp;
