// in app/components/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMobileMenu } from '@/app/context/MobileMenuContext';
import { 
  LayoutDashboard, CheckSquare, BrainCircuit, Bot, CalendarClock, Star, 
  BookOpen, GitMerge, Library, UploadCloud, Swords, ChevronsLeft, ChevronsRight, Wrench, X, StickyNote
} from 'lucide-react';
import GlobalTimerWidget from './GlobalTimerWidget';

const navGroups = [
  {
    title: 'Core',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/tasks', label: 'Tasks', icon: CheckSquare },
      { href: '/planner', label: 'Planner', icon: CalendarClock },
      { href: '/notes', label: 'Notes', icon: StickyNote }, // New Notes Page
    ]
  },
  {
    title: 'Learning',
    items: [
      { href: '/study-logs', label: 'Study Logs', icon: BrainCircuit },
      { href: '/resources', label: 'Resources', icon: Library },
      { href: '/practice', label: 'Practice', icon: Swords },
    ]
  },
  {
    title: 'Intelligence',
    items: [
      { href: '/assistant', label: 'AI Assistant', icon: Bot },
      { href: '/knowledge-graph', label: 'Knowledge Graph', icon: GitMerge },
      { href: '/gamification', label: 'Gamification', icon: Star },
      { href: '/journal', label: 'Journal', icon: BookOpen },
      { href: '/import', label: 'Import', icon: UploadCloud },
      { href: '/utilities', label: 'Utilities', icon: Wrench },
    ]
  }
];

// ... (The rest of the Sidebar component code is unchanged and can be copied from a previous correct version)
// For completeness, here is the full rest of the component:
const NavContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const pathname = usePathname();
  return (
    <nav className="flex-grow p-4 space-y-6">
      {navGroups.map((group) => (
        <div key={group.title}>
          <AnimatePresence>
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs font-bold uppercase text-neutral-500 mb-2 px-2 whitespace-nowrap"
            >
              {group.title}
            </motion.h2>
          </AnimatePresence>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    onClick={onLinkClick}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg transition-colors duration-200",
                      pathname === item.href 
                        ? "bg-cyan-500/10 text-cyan-300" 
                        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    )}
                  >
                    <Icon className="h-6 w-6 flex-shrink-0" />
                    <span className="overflow-hidden whitespace-nowrap">
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const { isOpen, closeMenu } = useMobileMenu();

  const isExpanded = !isCollapsed || isHovered;

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: isExpanded ? '16rem' : '5rem' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative bg-black/30 hidden md:flex flex-col border-r border-neutral-800/50 h-screen"
      >
        <div className="p-4 flex items-center justify-between flex-shrink-0">
          <AnimatePresence>
            {isExpanded && (
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-2xl font-bold text-white whitespace-nowrap"
              >
                AetherOS
              </motion.h1>
            )}
          </AnimatePresence>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg hover:bg-neutral-800">
            {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
          </button>
        </div>

        <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
          <NavContent />
        </div>
        
        <div className="flex-shrink-0">
          <GlobalTimerWidget />
        </div>
      </motion.aside>

      {/* Mobile Sidebar (Overlay) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex flex-col"
          >
            <div className="p-4 flex justify-between items-center border-b border-neutral-800 flex-shrink-0">
              <h1 className="text-2xl font-bold text-white">AetherOS</h1>
              <button onClick={closeMenu} className="p-2"><X /></button>
            </div>
            <div className="flex-grow overflow-y-auto">
              <NavContent onLinkClick={closeMenu} />
            </div>
            <div className="flex-shrink-0">
              <GlobalTimerWidget />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}