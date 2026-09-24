"use client";

import type { ReactNode } from "react";
import { CartProvider } from "./CartContext";
import { FulfillmentProvider } from "./FulfillmentContext";
import { FavoritesProvider } from "./FavoritesContext";
import { LanguageProvider } from "./LanguageContext";
import { SnackbarProvider } from "./SnackbarContext";
import { ThemeProvider } from "./ThemeContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SnackbarProvider>
          <FavoritesProvider>
            <CartProvider>
              <FulfillmentProvider>{children}</FulfillmentProvider>
            </CartProvider>
          </FavoritesProvider>
        </SnackbarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
