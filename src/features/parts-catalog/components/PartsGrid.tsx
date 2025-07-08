import { FC } from 'react'
import { Part } from '@services/db/dbService'
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'

interface PartsGridProps {
  parts: Part[]
  onViewPart: (part: Part) => void
  onEditPart: (part: Part) => void
  onDeletePart: (partId: string) => void
}

const PartsGrid: FC<PartsGridProps> = ({ parts, onViewPart, onEditPart, onDeletePart }) => {
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800'
      case 'In Stock':
        return 'bg-blue-100 text-blue-800'
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {parts.map((part) => (
        <div 
          key={part.id} 
          className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
        >
          {/* Part header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-gray-900 truncate" title={part.name}>
                {part.name}
              </h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(part.status)}`}>
                {part.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2" title={part.description}>
              {part.description}
            </p>
          </div>

          {/* Part details */}
          <div className="px-4 py-3 bg-gray-50">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-gray-500">Material:</span>
                <p className="font-medium text-gray-900">{part.material}</p>
              </div>
              <div>
                <span className="text-gray-500">Version:</span>
                <p className="font-medium text-gray-900">{part.version}</p>
              </div>
              <div>
                <span className="text-gray-500">Inventory:</span>
                <p className="font-medium text-gray-900">{part.unitsInInventory}</p>
              </div>
            </div>
          </div>

          {/* Part files */}
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex space-x-2">
              <a 
                href={part.stlFileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                STL File
              </a>
              <a 
                href={part.specSheetUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                Spec Sheet
              </a>
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
            <button
              onClick={() => onViewPart(part)}
              className="p-1 text-blue-600 hover:text-blue-900 rounded-full hover:bg-blue-100"
              title="View Details"
            >
              <EyeIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onEditPart(part)}
              className="p-1 text-indigo-600 hover:text-indigo-900 rounded-full hover:bg-indigo-100"
              title="Edit Part"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => part.id && onDeletePart(part.id)}
              className="p-1 text-red-600 hover:text-red-900 rounded-full hover:bg-red-100"
              title="Delete Part"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PartsGrid

// Made with Bob
