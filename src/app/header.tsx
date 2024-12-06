"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteIcon, LogInIcon, LogOutIcon, UserRoundPen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { deleteAccountAction } from "./actions";
import img from "@/public/default-image.png"
import LetterPullup from "@/components/ui/letter-pullup";

function AccountDropdown() {
  const router = useRouter();
  const session = useSession();
  const [open, setOpen] = useState(false);
  const avatarUrl = session.data?.user?.image ?? img.src;


  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove your
              account and any data you have.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteAccountAction();
                signOut({ callbackUrl: "/" });
              }}
            >
              Yes, delete my account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"link2"}>
            <Avatar className="">
            <AvatarImage 
              src={avatarUrl} 
              alt={session.data?.user?.name || "User Avatar"}
              onError={(e) => {
                e.currentTarget.src = img.src;
              }}
            />
              <AvatarFallback>
                {session.data?.user?.name?.[0] || 'CN'}
              </AvatarFallback>
            </Avatar>

            {/* {session.data?.user?.name} */}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => router.push('/profile')}>
            <UserRoundPen className="mr-2" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              signOut({
                callbackUrl: "/",
              })
            }
          >
            <LogOutIcon className="mr-2" /> Sign Out
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setOpen(true);
            }}
          >
            <DeleteIcon className="mr-2" /> Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export function Header() {
  const session = useSession();
  const router = useRouter();
  const isLoggedIn = !!session.data;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const MobileMenu = () => (
    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg border dark:border-gray-700">
      <div className="py-1">
        <Link
          href="/browse"
          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Browse
        </Link>
        <Link
          href="/your-rooms"
          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Your Rooms
        </Link>
        <Link
          href="/recommendations"
          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Recommendations
        </Link>
      </div>
    </div>
  );

  return (
    <header className="bg-gray-100 p-4 dark:bg-gray-900 z-10 relative rounded-xl shadow-[0_4px_10px_0_rgba(139,92,246,0.4),0_6px_15px_0_rgba(236,72,153,0.3)]">
      <div className="container mx-auto flex justify-between items-center relative">
        <Link
          href="/" 
          className="flex gap-2 items-center text-xl font-bold no-underline"
        >
          {/* <Image
            src="/logo.png"
            width="80"
            height="60"
            alt="the application icon"
          /> */}
          <LetterPullup words={"CodeCohort"} delay={0.05} />
          
        </Link>

        

        <nav className="hidden md:flex gap-8 items-center">
  {isLoggedIn && (
    <>

      <Link
        className="flex items-center text-black dark:text-gray-400 dark:hover:text-white hover:text-gray-700 transition-colors duration-200 ease-in-out"
        href="/browse"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
          />
        </svg>

        <span className="ml-3">Browse</span>
      </Link>

      <Link
        className="flex items-center text-black dark:text-gray-400 dark:hover:text-white hover:text-gray-700 transition-colors duration-200 ease-in-out"
        href="/your-rooms"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
        <span className="ml-3">Your Rooms</span>
      </Link>
      <Link
        className="flex items-center text-black dark:text-gray-400 dark:hover:text-white hover:text-gray-700 transition-colors duration-200 ease-in-out"
        href="/recommendations"
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
          />


        </svg>

        <span className="ml-3">Recommendations</span>
      </Link>
    </>
  )}
        </nav>

        <div className="flex items-center">
          {/* Mobile Menu Toggle */}
          {isLoggedIn && (
            <div className="relative md:hidden">
              <Button 
                variant="ghost" 
                className="mr-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              {isMobileMenuOpen && <MobileMenu />}
            </div>
          )}
          {isLoggedIn && <AccountDropdown />}
          {!isLoggedIn && (
            <Button onClick={() => router.push('/sign-in') } variant="link2">
              <LogInIcon className="mr-2" /> Sign In
            </Button>
          )}
        
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}