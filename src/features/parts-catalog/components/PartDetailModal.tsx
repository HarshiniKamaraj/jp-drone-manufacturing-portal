import { FC } from 'react'
import { Part } from '@services/db/dbService'
import { XMarkIcon, PencilIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'

interface PartDetailModalProps {
  part: Part
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
}

const PartDetailModal: FC<PartDetailModalProps> = ({ part, isOpen, onClose, onEdit }) => {
  if (!isOpen) return null

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-gray-800">{part.name}</h2>
            <span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full 
              ${part.status === 'Available' ? 'bg-green-100 text-green-800' : 
                part.status === 'In Stock' ? 'bg-blue-100 text-blue-800' : 
                'bg-yellow-100 text-yellow-800'}`}
            >
              {part.status}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Part details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600">{part.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Specifications</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Material</p>
                      <p className="text-base font-medium">{part.material}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Version</p>
                      <p className="text-base font-medium">{part.version}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Units in Inventory</p>
                      <p className="text-base font-medium">{part.unitsInInventory}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="text-base font-medium">{part.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Documentation</h3>
                <div className="space-y-2">
                  <a 
                    href={part.stlFileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                  >
                    <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                    <div>
                      <p className="font-medium">STL File</p>
                      <p className="text-xs">Download 3D model</p>
                    </div>
                  </a>
                  <a 
                    href={part.specSheetUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                  >
                    <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                    <div>
                      <p className="font-medium">Specification Sheet</p>
                      <p className="text-xs">Download technical specifications</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Right column - 3D preview and metadata */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">3D Model Preview</h3>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  {/* In a real implementation, this would be a Three.js component */}
                  <p className="text-gray-500">3D model preview would be rendered here</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Metadata</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="text-base">{formatDate(part.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-base">{formatDate(part.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end">
          <div className="flex space-x-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button 
              onClick={onEdit}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
            >
              <PencilIcon className="w-4 h-4 mr-1" />
              Edit Part
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartDetailModal

// Made with Bob
