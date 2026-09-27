"use client";

import type { ReactNode } from "react";
import { AddressBookProvider } from "./AddressBookContext";
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
              <FulfillmentProvider>
                <AddressBookProvider>{children}</AddressBookProvider>
              </FulfillmentProvider>
            </CartProvider>
          </FavoritesProvider>
        </SnackbarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
