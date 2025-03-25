"use client";

import * as React from "react";
import Link from "next/link";

interface NavigationItem {
  name: string;
  href: string;
}

interface VerticalNavigationMenuProps {
  items: NavigationItem[];
  loginHref?: string;
  className?: string;
}

export function VerticalNavigationMenu({
  items,
  loginHref = "#",
  className = "",
}: VerticalNavigationMenuProps) {
  return (
    <div className={`mt-6 flow-root ${className}`}>
      <div className="-my-6 divide-y divide-gray-500/10">
        <div className="space-y-2 py-6">
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
            >
              {item.name}
            </Link>
          ))}
        </div>
        {loginHref && (
          <div className="py-6">
            <Link
              href={loginHref}
              className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
            >
              Log in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
