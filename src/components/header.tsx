"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function Header() {
    return (
        <header className="bg-[#8B308C] text-white shadow-md">
            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="logo-geodinamica.svg"
                            alt="Logo Geodinâmica"
                            width={48}
                            height={48}
                            className="rounded-md"
                        />
                        <span className="text-xl font-bold">Geodinâmica</span>
                    </Link>
                    <div className="hidden md:flex space-x-4">
                        <Link href="/about" className="hover:underline">
                            Sobre
                        </Link>
                    </div>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Abrir menu</span>
                    </Button>
                </nav>
            </div>
        </header>
    )
}
