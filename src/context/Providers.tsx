"use client";

import type { ReactNode } from "react";
import { AddressBookProvider } from "./AddressBookContext";
import { CartProvider } from "./CartContext";
import { FulfillmentProvider } from "./FulfillmentContext";
import { FavoritesProvider } from "./FavoritesContext";
import { LanguageProvider } from "./LanguageContext";
import { SessionProvider } from "./SessionContext";
import { SnackbarProvider } from "./SnackbarContext";
import { ThemeProvider } from "./ThemeContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SnackbarProvider>
          <SessionProvider>
            <FavoritesProvider>
              <CartProvider>
                <FulfillmentProvider>
                  <AddressBookProvider>{children}</AddressBookProvider>
                </FulfillmentProvider>
              </CartProvider>
            </FavoritesProvider>
          </SessionProvider>
        </SnackbarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
