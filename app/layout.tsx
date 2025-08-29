import './globals.css'
import { Exo_2 } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import { cn } from '@/lib/utils'
import GlobalNoteForm from '@/components/GlobalNoteForm'
import { TimerProvider } from '@/app/context/TimerContext'
import { MobileMenuProvider } from '@/app/context/MobileMenuContext'
import MobileHeader from '@/components/MobileHeader'

const exo2 = Exo_2({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(exo2.className, "bg-black text-neutral-200")}>
        <TimerProvider>
          <MobileMenuProvider>
            <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            
            <div className="relative flex h-screen w-full">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <MobileHeader />
                <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-black/30 backdrop-blur-xl">
                  {children}
                </main>
              </div>
            </div>

            <GlobalNoteForm />
          </MobileMenuProvider>
        </TimerProvider>
      </body>
    </html>
  )
}
