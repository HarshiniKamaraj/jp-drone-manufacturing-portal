import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import db, { Part } from '@services/db/dbService'
import PartsTable from './components/PartsTable'
import PartsGrid from './components/PartsGrid'
import PartDetailModal from './components/PartDetailModal'
import PartFormModal from './components/PartFormModal'
import { PlusIcon, TableCellsIcon, Squares2X2Icon } from '@heroicons/react/24/outline'

const PartsCatalog = () => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Query parts from IndexedDB
  const parts = useLiveQuery(
    () => {
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase()
        return db.parts
          .filter(part => 
            part.name.toLowerCase().includes(lowerSearchTerm) || 
            part.description.toLowerCase().includes(lowerSearchTerm) ||
            part.material.toLowerCase().includes(lowerSearchTerm)
          )
          .toArray()
      }
      return db.parts.toArray()
    },
    [searchTerm]
  )

  const handlePartClick = (part: Part) => {
    setSelectedPart(part)
    setIsDetailModalOpen(true)
  }

  const handleAddNewPart = () => {
    setSelectedPart(null)
    setIsEditing(false)
    setIsFormModalOpen(true)
  }

  const handleEditPart = (part: Part) => {
    setSelectedPart(part)
    setIsEditing(true)
    setIsFormModalOpen(true)
  }

  const handleDeletePart = async (partId: string) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      try {
        await db.parts.delete(partId)
      } catch (error) {
        console.error('Error deleting part:', error)
        alert('Failed to delete part')
      }
    }
  }

  const handleSavePart = async (part: Part) => {
    try {
      if (isEditing && selectedPart?.id) {
        // Update existing part
        await db.parts.update(selectedPart.id, {
          ...part,
          updatedAt: new Date()
        })
      } else {
        // Add new part
        await db.parts.add({
          ...part,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
      setIsFormModalOpen(false)
    } catch (error) {
      console.error('Error saving part:', error)
      alert('Failed to save part')
    }
  }

  const closeDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedPart(null)
  }

  const closeFormModal = () => {
    setIsFormModalOpen(false)
    if (!isEditing) {
      setSelectedPart(null)
    }
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === 'table' ? 'grid' : 'table')
  }

  if (!parts) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Parts Catalog</h1>
        <div className="flex space-x-2">
          <button
            onClick={toggleViewMode}
            className="p-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            title={viewMode === 'table' ? 'Switch to Grid View' : 'Switch to Table View'}
          >
            {viewMode === 'table' ? (
              <Squares2X2Icon className="w-5 h-5" />
            ) : (
              <TableCellsIcon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleAddNewPart}
            className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            <span>Add Part</span>
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search parts by name, description, or material..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setSearchTerm('')}
          >
            ×
          </button>
        )}
      </div>

      {/* Parts list */}
      {parts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">
            {searchTerm ? 'No parts match your search criteria.' : 'No parts available in the catalog.'}
          </p>
          {searchTerm && (
            <button
              className="mt-2 text-primary-600 hover:text-primary-800"
              onClick={() => setSearchTerm('')}
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        viewMode === 'table' ? (
          <PartsTable 
            parts={parts} 
            onViewPart={handlePartClick}
            onEditPart={handleEditPart}
            onDeletePart={handleDeletePart}
          />
        ) : (
          <PartsGrid 
            parts={parts} 
            onViewPart={handlePartClick}
            onEditPart={handleEditPart}
            onDeletePart={handleDeletePart}
          />
        )
      )}

      {/* Part detail modal */}
      {selectedPart && (
        <PartDetailModal 
          part={selectedPart} 
          isOpen={isDetailModalOpen} 
          onClose={closeDetailModal}
          onEdit={() => {
            closeDetailModal()
            handleEditPart(selectedPart)
          }}
        />
      )}

      {/* Part form modal (add/edit) */}
      <PartFormModal
        part={isEditing ? selectedPart : null}
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        onSave={handleSavePart}
        isEditing={isEditing}
      />
    </div>
  )
}

export default PartsCatalog

// Made with Bob
