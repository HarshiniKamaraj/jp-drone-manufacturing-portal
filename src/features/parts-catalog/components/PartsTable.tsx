import { FC, useState } from 'react'
import { Part } from '@services/db/dbService'
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon 
} from '@heroicons/react/24/outline'

interface PartsTableProps {
  parts: Part[]
  onViewPart: (part: Part) => void
  onEditPart: (part: Part) => void
  onDeletePart: (partId: string) => void
}

type SortField = 'name' | 'material' | 'status' | 'version' | 'unitsInInventory'
type SortDirection = 'asc' | 'desc'

const PartsTable: FC<PartsTableProps> = ({ parts, onViewPart, onEditPart, onDeletePart }) => {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New field, default to ascending
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Sort parts based on current sort field and direction
  const sortedParts = [...parts].sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null

    return sortDirection === 'asc' ? (
      <ArrowUpIcon className="w-4 h-4 inline-block ml-1" />
    ) : (
      <ArrowDownIcon className="w-4 h-4 inline-block ml-1" />
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('name')}
            >
              <span className="flex items-center">
                Name {renderSortIndicator('name')}
              </span>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('material')}
            >
              <span className="flex items-center">
                Material {renderSortIndicator('material')}
              </span>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('status')}
            >
              <span className="flex items-center">
                Status {renderSortIndicator('status')}
              </span>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('version')}
            >
              <span className="flex items-center">
                Version {renderSortIndicator('version')}
              </span>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('unitsInInventory')}
            >
              <span className="flex items-center">
                Inventory {renderSortIndicator('unitsInInventory')}
              </span>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedParts.map((part) => (
            <tr 
              key={part.id} 
              className="hover:bg-gray-50"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {part.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {part.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {part.material}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${part.status === 'Available' ? 'bg-green-100 text-green-800' : 
                    part.status === 'In Stock' ? 'bg-blue-100 text-blue-800' : 
                    'bg-yellow-100 text-yellow-800'}`}
                >
                  {part.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {part.version}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {part.unitsInInventory}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onViewPart(part)}
                    className="text-blue-600 hover:text-blue-900"
                    title="View Details"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onEditPart(part)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Edit Part"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => part.id && onDeletePart(part.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete Part"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PartsTable

// Made with Bob
