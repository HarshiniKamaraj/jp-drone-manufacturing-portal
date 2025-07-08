import { FC, useState, useEffect } from 'react'
import { Part } from '@services/db/dbService'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface PartFormModalProps {
  part: Part | null
  isOpen: boolean
  onClose: () => void
  onSave: (part: Part) => void
  isEditing: boolean
}

const PartFormModal: FC<PartFormModalProps> = ({ part, isOpen, onClose, onSave, isEditing }) => {
  const [formData, setFormData] = useState<Partial<Part>>({
    name: '',
    description: '',
    material: '',
    status: 'Available',
    version: '',
    unitsInInventory: 0,
    stlFileUrl: '',
    specSheetUrl: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form with part data when editing
  useEffect(() => {
    if (isEditing && part) {
      setFormData({
        name: part.name,
        description: part.description,
        material: part.material,
        status: part.status,
        version: part.version,
        unitsInInventory: part.unitsInInventory,
        stlFileUrl: part.stlFileUrl,
        specSheetUrl: part.specSheetUrl
      })
    } else {
      // Reset form when adding a new part
      setFormData({
        name: '',
        description: '',
        material: '',
        status: 'Available',
        version: '',
        unitsInInventory: 0,
        stlFileUrl: '',
        specSheetUrl: ''
      })
    }
    setErrors({})
  }, [part, isEditing, isOpen])

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Handle number inputs
    if (name === 'unitsInInventory') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!formData.material?.trim()) {
      newErrors.material = 'Material is required'
    }
    
    if (!formData.version?.trim()) {
      newErrors.version = 'Version is required'
    }
    
    if (formData.unitsInInventory === undefined || formData.unitsInInventory < 0) {
      newErrors.unitsInInventory = 'Inventory must be a non-negative number'
    }
    
    if (!formData.stlFileUrl?.trim()) {
      newErrors.stlFileUrl = 'STL file URL is required'
    }
    
    if (!formData.specSheetUrl?.trim()) {
      newErrors.specSheetUrl = 'Spec sheet URL is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave(formData as Part)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Edit Part' : 'Add New Part'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.description ? 'border-red-500' : ''
                }`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Material */}
            <div>
              <label htmlFor="material" className="block text-sm font-medium text-gray-700">
                Material <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="material"
                name="material"
                value={formData.material}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.material ? 'border-red-500' : ''
                }`}
              />
              {errors.material && <p className="mt-1 text-sm text-red-600">{errors.material}</p>}
            </div>

            {/* Two columns for Status and Version */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="Available">Available</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              {/* Version */}
              <div>
                <label htmlFor="version" className="block text-sm font-medium text-gray-700">
                  Version <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="version"
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  placeholder="e.g., v1.0"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                    errors.version ? 'border-red-500' : ''
                  }`}
                />
                {errors.version && <p className="mt-1 text-sm text-red-600">{errors.version}</p>}
              </div>
            </div>

            {/* Units in Inventory */}
            <div>
              <label htmlFor="unitsInInventory" className="block text-sm font-medium text-gray-700">
                Units in Inventory <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="unitsInInventory"
                name="unitsInInventory"
                min="0"
                value={formData.unitsInInventory}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.unitsInInventory ? 'border-red-500' : ''
                }`}
              />
              {errors.unitsInInventory && <p className="mt-1 text-sm text-red-600">{errors.unitsInInventory}</p>}
            </div>

            {/* STL File URL */}
            <div>
              <label htmlFor="stlFileUrl" className="block text-sm font-medium text-gray-700">
                STL File URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="stlFileUrl"
                name="stlFileUrl"
                value={formData.stlFileUrl}
                onChange={handleChange}
                placeholder="URL to STL file"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.stlFileUrl ? 'border-red-500' : ''
                }`}
              />
              {errors.stlFileUrl && <p className="mt-1 text-sm text-red-600">{errors.stlFileUrl}</p>}
            </div>

            {/* Spec Sheet URL */}
            <div>
              <label htmlFor="specSheetUrl" className="block text-sm font-medium text-gray-700">
                Spec Sheet URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="specSheetUrl"
                name="specSheetUrl"
                value={formData.specSheetUrl}
                onChange={handleChange}
                placeholder="URL to specification sheet"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                  errors.specSheetUrl ? 'border-red-500' : ''
                }`}
              />
              {errors.specSheetUrl && <p className="mt-1 text-sm text-red-600">{errors.specSheetUrl}</p>}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end">
          <div className="flex space-x-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              {isEditing ? 'Update Part' : 'Add Part'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartFormModal

// Made with Bob
