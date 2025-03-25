"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@foundations/shadcn/components/navigation-menu";

interface NavigationItem {
  name: string;
  href: string;
}

interface SimpleNavigationMenuProps {
  items: NavigationItem[];
  className?: string;
}

export function SimpleNavigationMenu({
  items,
  className = "",
}: SimpleNavigationMenuProps) {
  return (
    <div className={`w-full ${className}`}>
      <NavigationMenu>
        <NavigationMenuList>
          {items.map((item) => (
            <NavigationMenuItem key={item.name}>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle({
                  className:
                    "bg-transparent hover:bg-transparent focus:bg-transparent",
                })}
              >
                <Link href={item.href}>{item.name}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
