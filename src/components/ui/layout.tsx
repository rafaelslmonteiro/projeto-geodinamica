import React from 'react'
import Link from 'next/link'
import { Book, Menu } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#1D2C40] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Book size={24} />
            <span className="text-xl font-bold">Geodinâmica</span>
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="hover:text-[#25B8D9] transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#25B8D9] transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#25B8D9] transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-[#1D2C40] text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Geodinâmica. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}