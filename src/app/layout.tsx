import "./globals.css";
import Providers from "./providers";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Metadata } from "next";
import NonSsrWrapper from "@/components/non-ssr-wrapper";
import { Telescope } from "lucide-react";

export const metadata: Metadata = {
  title: "Clerk Pro",
  description: "Search Clerk users, including metadata..",
};

// UI that is shared and automatically applied to all routes
const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-background'>
        <NonSsrWrapper>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange>
            <Providers>
              <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur'>
                <div className='container flex h-14 items-center'>
                  <div className='mr-4 hidden gap-2 font-semibold md:flex'>
                    <Telescope />
                    clerk-pro
                  </div>
                  <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
                    <ModeToggle />
                  </div>
                </div>
              </header>
              {children}
            </Providers>
          </ThemeProvider>
        </NonSsrWrapper>
      </body>
    </html>
  );
};

export default RootLayout;

// See more at:
// https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr#initial-setup
// https://github.com/pacocoursey/next-themes?tab=readme-ov-file#avoid-hydration-mismatch
// https://github.com/shadcn-ui/ui/issues/926
