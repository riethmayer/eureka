import { ReactNode } from "react";
import Head from "next/head";
import NavBar from "./nav-bar";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "Eureka" }: Props) => (
  <>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <NavBar />
    {children}
  </>
);

export default Layout;
