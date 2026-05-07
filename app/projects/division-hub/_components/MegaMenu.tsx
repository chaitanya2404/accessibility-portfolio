"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { departmentList } from "../data";

export function MegaMenu() {
  return (
    <NavigationMenu.Root className="relative z-20">
      <NavigationMenu.List className="flex items-center gap-1">
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link
              href="/projects/division-hub"
              className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              Overview
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="group inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 data-[state=open]:bg-slate-100 data-[state=open]:text-slate-900">
            Departments
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute left-0 top-full mt-2 w-[min(92vw,640px)] rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
            <ul className="grid gap-2 sm:grid-cols-2">
              {departmentList.map((dept) => (
                <li key={dept.slug}>
                  <NavigationMenu.Link asChild>
                    <Link
                      href={`/projects/division-hub/${dept.slug}`}
                      className="block rounded-md p-3 hover:bg-slate-50 focus-visible:bg-slate-50"
                    >
                      <span className="block text-sm font-semibold text-slate-900">
                        {dept.name}
                      </span>
                      <span className="mt-1 block text-sm text-slate-600">
                        {dept.shortDescription}
                      </span>
                    </Link>
                  </NavigationMenu.Link>
                </li>
              ))}
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
