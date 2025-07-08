import { FC } from 'react'
import { PrintJob, Part } from '@services/db/dbService'
import { 
  PencilIcon, 
  TrashIcon, 
  PauseIcon,
  PlayIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

interface PrintJobTableProps {
  jobs: PrintJob[]
  parts: Part[]
  onEditJob: (job: PrintJob) => void
  onDeleteJob: (jobId: string) => void
  onJobAction: (jobId: string, action: 'pause' | 'resume' | 'cancel' | 'complete') => void
}

const PrintJobTable: FC<PrintJobTableProps> = ({ jobs, parts, onEditJob, onDeleteJob, onJobAction }) => {
  // Helper function to get part name by ID
  const getPartName = (partId: string): string => {
    const part = parts.find(p => p.id === partId)
    return part ? part.name : 'Unknown Part'
  }

  // Format date for display
  const formatDate = (date: Date | undefined): string => {
    if (!date) return 'N/A'
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  // Helper function to get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Pending':
        return 'bg-blue-100 text-blue-800'
      case 'Printing':
        return 'bg-purple-100 text-purple-800'
      case 'Paused':
        return 'bg-orange-100 text-orange-800'
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate progress percentage for printing jobs
  const calculateProgress = (job: PrintJob): number => {
    if (job.status !== 'Printing' || !job.startTime || !job.estimatedCompletion) {
      return 0
    }

    const now = new Date()
    const start = new Date(job.startTime)
    const end = new Date(job.estimatedCompletion)
    
    // If estimated completion is in the past, return 100%
    if (now > end) return 100
    
    const totalDuration = end.getTime() - start.getTime()
    const elapsedDuration = now.getTime() - start.getTime()
    
    return Math.min(100, Math.max(0, Math.round((elapsedDuration / totalDuration) * 100)))
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Job ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Part
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Operator
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Est. Completion
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {job.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getPartName(job.partId)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {job.operatorId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                  
                  {job.status === 'Printing' && job.startTime && job.estimatedCompletion && (
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${calculateProgress(job)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(job.startTime)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(job.estimatedCompletion)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  {/* Status-specific action buttons */}
                  {job.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => job.id && onJobAction(job.id, 'cancel')}
                        className="text-red-600 hover:text-red-900"
                        title="Cancel Job"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  
                  {job.status === 'Printing' && (
                    <>
                      <button
                        onClick={() => job.id && onJobAction(job.id, 'pause')}
                        className="text-orange-600 hover:text-orange-900"
                        title="Pause Job"
                      >
                        <PauseIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => job.id && onJobAction(job.id, 'complete')}
                        className="text-green-600 hover:text-green-900"
                        title="Complete Job"
                      >
                        <CheckIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => job.id && onJobAction(job.id, 'cancel')}
                        className="text-red-600 hover:text-red-900"
                        title="Cancel Job"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  
                  {job.status === 'Paused' && (
                    <>
                      <button
                        onClick={() => job.id && onJobAction(job.id, 'resume')}
                        className="text-green-600 hover:text-green-900"
                        title="Resume Job"
                      >
                        <PlayIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => job.id && onJobAction(job.id, 'cancel')}
                        className="text-red-600 hover:text-red-900"
                        title="Cancel Job"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  
                  {/* Edit button (always available) */}
                  <button
                    onClick={() => onEditJob(job)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Edit Job"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  
                  {/* Delete button (always available) */}
                  <button
                    onClick={() => job.id && onDeleteJob(job.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete Job"
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

export default PrintJobTable

// Made with Bob
