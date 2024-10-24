"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccount } from "wagmi";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Register", href: "/register" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const { isConnected } = useAccount();

  return (
    <header className="fixed top-6 left-6 right-6 z-50">
      <nav className="container mx-auto rounded-full bg-background/30 backdrop-blur-lg border border-border/40 shadow-lg">
        <div className="px-6 sm:px-8 lg:px-12 mx-auto flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-foreground">
              SkillSphere
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-6">
              {isConnected
                ? navItems.map((item, index) => (
                    <React.Fragment key={index}>
                      {item.href === "/register" ? (
                        <Button
                          key={index}
                          variant="outline"
                          asChild
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Link
                            href={item.href}
                            className="text-base font-medium"
                          >
                            {item.name}
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          key={index}
                          variant="outline"
                          asChild
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Link
                            href={item.href}
                            className="text-base font-medium"
                          >
                            {item.name}
                          </Link>
                        </Button>
                      )}
                    </React.Fragment>
                  ))
                : null}
              <ConnectButton />
            </div>
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-primary/20 hover:text-primary"
                  >
                    <User className="h-6 w-6" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/logout">Logout</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full md:hidden hover:bg-primary/20 hover:text-primary"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-4">
                  {navItems.map((item) => (
                    <React.Fragment key={item.href}>
                      {item.href === "/register" ? (
                        <Button
                          key={item.href}
                          variant="outline"
                          asChild
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <MobileLink
                            href={item.href}
                            onOpenChange={setIsOpen}
                            className="justify-center"
                          >
                            {item.name}
                          </MobileLink>
                        </Button>
                      ) : (
                        <Button
                          key={item.href}
                          variant="outline"
                          asChild
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <MobileLink
                            key={item.href}
                            href={item.href}
                            onOpenChange={setIsOpen}
                            className="justify-center"
                          >
                            {item.name}
                          </MobileLink>
                        </Button>
                      )}
                    </React.Fragment>
                  ))}
                  <div className="pt-4">
                    <ConnectButton />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}

interface MobileLinkProps extends React.PropsWithChildren {
  href: string;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
}: MobileLinkProps) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      onClick={() => onOpenChange?.(false)}
      className={cn(
        "text-foreground/70 transition-colors hover:text-foreground",
        pathname === href && "text-foreground font-medium",
        className
      )}
    >
      {children}
    </Link>
  );
}
