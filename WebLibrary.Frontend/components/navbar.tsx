// @ts-nocheck
"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import Link from 'next/link'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Avatar } from "@nextui-org/avatar";
import { Library } from "lucide-react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {signOut, useSession} from "next-auth/react";
import {UserRole} from "@/types/userRole";
import {useRouter} from "next/navigation";

export const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const avatarUrl = session?.user?.image ?? 
      `https://ui-avatars.com/api/?name=${session?.user?.name?.replace(" ","+")}`
    
    const adminDropdown =  session?.user?.role! === UserRole.admin &&
        <DropdownItem key="admin" onClick={() => router.push("/admin")}>
            Адмін-панель
        </DropdownItem>
  
  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent>
        <NavbarMenuToggle className="sm:hidden" />
        <NavbarBrand>
          <Library className="mr-2" size={30} />
          <p className="font-bold text-inherit hidden sm:block">Your ary</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {siteConfig.navItems.map((item, index) => (
          <NavbarItem key={`${item}-${index}`}>
            <Link className="hover:text-primary transition-colors" color="foreground" href={item.href}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <ThemeSwitch />
        {session ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={session!.user!.name!}
                size="sm"
                src={avatarUrl}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Увійшли як</p>
                <p className="font-semibold">{session!.user!.email}</p>
              </DropdownItem>
              <DropdownItem key="books" onClick={() => {
                router.push("/books/collection")
                router.refresh()
              }}>Мої книги</DropdownItem>
              <DropdownItem key="settings" onClick={() => router.push("/profile")}>
                      Налаштування
              </DropdownItem>
                { 
                  session.user.role === UserRole.admin &&
                    <DropdownItem key="admin" onClick={() => router.push("/admin")}>
                      Адмін-панель
                    </DropdownItem>
                }
              <DropdownItem key="logout" color="danger" onClick={async () => await signOut()}>
                Вийти
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavbarItem>
            <Button as={Link} color="primary" href="/auth" variant="flat">
              Login
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu>
        {siteConfig.navItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link className="w-full" color="foreground" href={item.href}>
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextUINavbar>
  );
};
