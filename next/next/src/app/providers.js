"use client";

import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { store } from "../store/page";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </Provider>
  );
}
