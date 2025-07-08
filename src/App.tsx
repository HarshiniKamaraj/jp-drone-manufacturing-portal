import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { initializeDatabase } from '@services/db/dbService'
import Layout from '@components/layout/Layout'
import Dashboard from '@features/dashboard/Dashboard'
import PartsCatalog from '@features/parts-catalog/PartsCatalog'
import PrintQueue from '@features/print-queue/PrintQueue'

function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false)
  const [dbError, setDbError] = useState<string | null>(null)

  useEffect(() => {
    const initDb = async () => {
      try {
        await initializeDatabase()
        setIsDbInitialized(true)
      } catch (error) {
        console.error('Failed to initialize database:', error)
        setDbError(error instanceof Error ? error.message : 'Unknown database error')
      }
    }

    initDb()
  }, [])

  if (dbError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-error-50">
        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-y-4">
          <div className="text-xl font-medium text-error-700">Database Error</div>
          <p className="text-error-500">{dbError}</p>
          <button 
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!isDbInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-lg font-medium text-gray-700">Initializing database...</span>
      </div>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/parts" element={<PartsCatalog />} />
        <Route path="/print-queue" element={<PrintQueue />} />
      </Routes>
    </Layout>
  )
}

export default App

// Made with Bob
