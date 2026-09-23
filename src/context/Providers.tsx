"use client";

import type { ReactNode } from "react";
import { CartProvider } from "./CartContext";
import { FavoritesProvider } from "./FavoritesContext";
import { LanguageProvider } from "./LanguageContext";
import { SnackbarProvider } from "./SnackbarContext";
import { ThemeProvider } from "./ThemeContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <FavoritesProvider>
          <CartProvider>
            <SnackbarProvider>{children}</SnackbarProvider>
          </CartProvider>
        </FavoritesProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
