import { FC, useState, useEffect } from 'react'
import { PrintJob, Part } from '@services/db/dbService'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface PrintJobFormModalProps {
  job: PrintJob | null
  isOpen: boolean
  onClose: () => void
  onSave: (job: PrintJob) => void
  isEditing: boolean
  parts: Part[]
}

const PrintJobFormModal: FC<PrintJobFormModalProps> = ({ 
  job, 
  isOpen, 
  onClose, 
  onSave, 
  isEditing,
  parts 
}) => {
  const [formData, setFormData] = useState<Partial<PrintJob>>({
    partId: '',
    operatorId: '',
    status: 'Pending',
    startTime: undefined,
    estimatedCompletion: undefined
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form with job data when editing
  useEffect(() => {
    if (isEditing && job) {
      setFormData({
        partId: job.partId,
        operatorId: job.operatorId,
        status: job.status,
        startTime: job.startTime,
        estimatedCompletion: job.estimatedCompletion
      })
    } else {
      // Reset form when adding a new job
      setFormData({
        partId: parts.length > 0 ? parts[0].id : '',
        operatorId: '',
        status: 'Pending',
        startTime: undefined,
        estimatedCompletion: undefined
      })
    }
    setErrors({})
  }, [job, isEditing, isOpen, parts])

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (value) {
      setFormData(prev => ({ ...prev, [name]: new Date(value) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: undefined }))
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.partId) {
      newErrors.partId = 'Part selection is required'
    }
    
    if (!formData.operatorId?.trim()) {
      newErrors.operatorId = 'Operator ID is required'
    }
    
    if (formData.startTime && formData.estimatedCompletion) {
      const startTime = new Date(formData.startTime)
      const estimatedCompletion = new Date(formData.estimatedCompletion)
      
      if (estimatedCompletion <= startTime) {
        newErrors.estimatedCompletion = 'Estimated completion must be after start time'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave(formData as PrintJob)
    }
  }

  // Format date for input fields
  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return ''
    
    const d = new Date(date)
    return d.toISOString().slice(0, 16) // Format as YYYY-MM-DDTHH:MM
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Edit Print Job' : 'Add New Print Job'}
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
            {/* Part Selection */}
            <div>
              <label htmlFor="partId" className="block text-sm font-medium text-gray-700 bg-white">
                Part <span className="text-red-500">*</span>
              </label>
              <select
                id="partId"
                name="partId"
                value={formData.partId}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white ${
                  errors.partId ? 'border-red-500' : ''
                }`}
              >
                <option value="" disabled>Select a part</option>
                {parts.map(part => (
                  <option key={part.id} value={part.id}>
                    {part.name} ({part.version})
                  </option>
                ))}
              </select>
              {errors.partId && <p className="mt-1 text-sm text-red-600">{errors.partId}</p>}
            </div>

            {/* Operator ID */}
            <div>
              <label htmlFor="operatorId" className="block text-sm font-medium text-gray-700 bg-white">
                Operator ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="operatorId"
                name="operatorId"
                value={formData.operatorId}
                onChange={handleChange}
                placeholder="e.g., OP-007"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white ${
                  errors.operatorId ? 'border-red-500' : ''
                }`}
              />
              {errors.operatorId && <p className="mt-1 text-sm text-red-600">{errors.operatorId}</p>}
            </div>

            {/* Status (only for editing) */}
            {isEditing && (
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 bg-white">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Printing">Printing</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            )}

            {/* Start Time */}
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 bg-white">
                Start Time
              </label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={formatDateForInput(formData.startTime)}
                onChange={handleDateChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white"
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave blank for jobs that haven't started yet
              </p>
            </div>

            {/* Estimated Completion */}
            <div>
              <label htmlFor="estimatedCompletion" className="block text-sm font-medium text-gray-700 bg-white">
                Estimated Completion
              </label>
              <input
                type="datetime-local"
                id="estimatedCompletion"
                name="estimatedCompletion"
                value={formatDateForInput(formData.estimatedCompletion)}
                onChange={handleDateChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white ${
                  errors.estimatedCompletion ? 'border-red-500' : ''
                }`}
              />
              {errors.estimatedCompletion && (
                <p className="mt-1 text-sm text-red-600">{errors.estimatedCompletion}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Leave blank if unknown
              </p>
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
              {isEditing ? 'Update Job' : 'Add Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrintJobFormModal

// Made with Bob
