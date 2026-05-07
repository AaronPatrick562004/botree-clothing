"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, User, Heart, Search } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SearchBar } from "@/components/search-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/category/men", label: "Men" },
  { href: "/category/women", label: "Women" },
  { href: "/category/kids", label: "Kids" },
  { href: "/category/new-arrivals", label: "New Arrivals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const MobileMenu = () => {
    if (!mounted) return null;

    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            className="h-11 w-11" // ✅ touch-friendly
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        {/* ✅ responsive width */}
        <SheetContent side="left" className="w-[85%] max-w-xs">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

          <nav className="flex flex-col gap-1 mt-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium py-3 px-4 rounded-lg hover:bg-secondary transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t mt-4 pt-4">
              {user? (
                <>
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    Signed in as <span className="font-medium text-foreground">{user.name}</span>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-secondary"
                  >
                    <User className="h-5 w-5" />
                    My Profile
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-secondary w-full text-left"
                  >
                    <User className="h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-secondary"
                >
                  <User className="h-5 w-5" />
                  Login / Sign Up
                </Link>
              )}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-2 sm:px-4 py-3 lg:px-8">

        {/* Mobile menu */}
        <div className="lg:hidden">
          <MobileMenu />
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="font-serif text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight">
            BOTREE
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs xl:text-sm font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h- after:w-0 hover:after:w-full after:bg-primary after:transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* Search - Popover with navy + gold styling */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost"
                size="icon" 
                aria-label="Search" 
                className="h-11 w-11"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              side="bottom"
              align="end"
              avoidCollisions
              collisionPadding={8}
              className="w-[min(calc(100vw-1rem),28rem)] p-3 mt-2 bg-[#1e2a4a] border-2 border-[#d4af37] rounded-xl shadow-xl"
              sideOffset={8}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <SearchBar />
            </PopoverContent>
          </Popover>

          {/* Wishlist */}
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" aria-label="Wishlist" className="h-11 w-11">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>

          {/* User */}
          {user? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account" className="h-11 w-11">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/wishlist">Wishlist</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <User className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon" aria-label="Login" className="h-11 w-11">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" aria-label="Cart" className="h-11 w-11">
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-h- min-w- px-1 rounded-full bg-primary text-primary-foreground text- flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

        </div>
      </div>
    </header>
  );
}
