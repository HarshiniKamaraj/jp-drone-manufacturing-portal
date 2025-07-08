import { ReactNode, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { 
  ChartBarIcon, 
  CubeIcon, 
  PrinterIcon, 
  Bars3Icon, 
  XMarkIcon 
} from '@heroicons/react/24/outline'

interface LayoutProps {
  children: ReactNode
}

interface NavItemProps {
  to: string
  icon: ReactNode
  label: string
  onClick?: () => void
}

const NavItem = ({ to, icon, label, onClick }: NavItemProps) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `
      flex items-center px-4 py-3 text-gray-700 rounded-lg
      ${isActive ? 'bg-primary-100 text-primary-800' : 'hover:bg-gray-100'}
      transition-colors duration-200
    `}
    onClick={onClick}
  >
    <div className="w-6 h-6 mr-3">
      {icon}
    </div>
    <span className="font-medium">{label}</span>
  </NavLink>
)

const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Jivan Pakshi</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem to="/" icon={<ChartBarIcon />} label="Dashboard" />
          <NavItem to="/parts" icon={<CubeIcon />} label="Parts Catalog" />
          <NavItem to="/print-queue" icon={<PrinterIcon />} label="Print Queue" />
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
              OP
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Operator</p>
              <p className="text-xs text-gray-500">OP-007</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">Jivan Pakshi</h1>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
        >
          {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-gray-800 bg-opacity-50">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h1 className="text-lg font-bold text-gray-800">Jivan Pakshi</h1>
              <button 
                onClick={toggleMobileMenu}
                className="p-1 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              <NavItem to="/" icon={<ChartBarIcon />} label="Dashboard" onClick={closeMobileMenu} />
              <NavItem to="/parts" icon={<CubeIcon />} label="Parts Catalog" onClick={closeMobileMenu} />
              <NavItem to="/print-queue" icon={<PrinterIcon />} label="Print Queue" onClick={closeMobileMenu} />
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                  OP
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Operator</p>
                  <p className="text-xs text-gray-500">OP-007</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pt-4 md:pt-0">
        <div className="md:hidden h-12"></div> {/* Spacer for mobile header */}
        <div className="container mx-auto px-4 py-4">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout

// Made with Bob
