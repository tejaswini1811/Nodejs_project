"use client";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReduxProvider } from "@/redux/provider";
import { store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import NextTopLoader from "nextjs-toploader";
import { Poppins } from "next/font/google";
import "@fontsource/poppins";
import "@/app/global.css";

import { Typography } from "@mui/material";

// const poppins = Poppins({ subsets: ['latin'], })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          {/* <PersistGate loading={null} persistor={persistor}> */}
          <ThemeProvider theme={baselightTheme}>
            {/* <NextTopLoader /> */}
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {children}
          </ThemeProvider>
          {/* </PersistGate> */}
        </Provider>
      </body>
    </html>
  );
}
