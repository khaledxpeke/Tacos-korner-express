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
        <FavoritesProvider>
          <CartProvider>
            <FulfillmentProvider>
              <SnackbarProvider>{children}</SnackbarProvider>
            </FulfillmentProvider>
          </CartProvider>
        </FavoritesProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
