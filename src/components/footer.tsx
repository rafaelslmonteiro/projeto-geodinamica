"use client"

import { Book } from "lucide-react"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-muted">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <Book className="h-6 w-6" />
                        <span className="text-sm font-semibold">
                            © 2024 Geodinâmica. Todos os direitos reservados.
                        </span>
                    </div>
                    <nav className="flex space-x-4">
                        <Link href="/about" className="text-sm hover:underline">
                            Sobre
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    )
}
