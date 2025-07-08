import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import db, { PrintJob } from '@services/db/dbService'
import PrintJobTable from './components/PrintJobTable'
import PrintJobFormModal from './components/PrintJobFormModal'
import { PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const MAX_ACTIVE_JOBS = 50

const PrintQueue = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterOperator, setFilterOperator] = useState<string>('all')
  const [operators, setOperators] = useState<string[]>([])

  // Query print jobs from IndexedDB
  const printJobs = useLiveQuery(() => {
    let query = db.printJobs.toArray()
    return query
  })

  // Query parts for the form
  const parts = useLiveQuery(() => db.parts.toArray())

  // Extract unique operator IDs for filtering
  useEffect(() => {
    if (printJobs) {
      const uniqueOperators = Array.from(
        new Set(printJobs.map(job => job.operatorId))
      ).filter(Boolean)
      setOperators(uniqueOperators as string[])
    }
  }, [printJobs])

  // Filter jobs based on selected filters
  const filteredJobs = printJobs?.filter(job => {
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus
    const matchesOperator = filterOperator === 'all' || job.operatorId === filterOperator
    return matchesStatus && matchesOperator
  })

  // Count active jobs (Pending, Printing, Paused)
  const activeJobsCount = printJobs?.filter(job => 
    ['Pending', 'Printing', 'Paused'].includes(job.status)
  ).length || 0

  const handleAddNewJob = () => {
    if (activeJobsCount >= MAX_ACTIVE_JOBS) {
      alert(`Maximum job limit reached (${MAX_ACTIVE_JOBS}). Please complete or cancel existing jobs before adding new ones.`)
      return
    }
    
    setSelectedJob(null)
    setIsEditing(false)
    setIsFormModalOpen(true)
  }

  const handleEditJob = (job: PrintJob) => {
    setSelectedJob(job)
    setIsEditing(true)
    setIsFormModalOpen(true)
  }

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this print job?')) {
      try {
        await db.printJobs.delete(jobId)
      } catch (error) {
        console.error('Error deleting print job:', error)
        alert('Failed to delete print job')
      }
    }
  }

  const handleSaveJob = async (job: PrintJob) => {
    try {
      if (isEditing && selectedJob?.id) {
        // Update existing job
        await db.printJobs.update(selectedJob.id, {
          ...job,
          updatedAt: new Date()
        })
      } else {
        // Check active job limit before adding
        if (activeJobsCount >= MAX_ACTIVE_JOBS) {
          alert(`Maximum job limit reached (${MAX_ACTIVE_JOBS}). Please complete or cancel existing jobs before adding new ones.`)
          return
        }
        
        // Add new job
        await db.printJobs.add({
          ...job,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
      setIsFormModalOpen(false)
    } catch (error) {
      console.error('Error saving print job:', error)
      alert('Failed to save print job')
    }
  }

  const handleJobAction = async (jobId: string, action: 'pause' | 'resume' | 'cancel' | 'complete') => {
    try {
      const job = await db.printJobs.get(jobId)
      if (!job) return

      let newStatus: string
      switch (action) {
        case 'pause':
          newStatus = 'Paused'
          break
        case 'resume':
          newStatus = 'Printing'
          break
        case 'cancel':
          newStatus = 'Failed'
          break
        case 'complete':
          newStatus = 'Completed'
          break
        default:
          return
      }

      await db.printJobs.update(jobId, {
        status: newStatus,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error(`Error performing ${action} action:`, error)
      alert(`Failed to ${action} job`)
    }
  }

  const closeFormModal = () => {
    setIsFormModalOpen(false)
    if (!isEditing) {
      setSelectedJob(null)
    }
  }

  if (!printJobs || !parts) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Print Queue</h1>
        <button
          onClick={handleAddNewJob}
          className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          disabled={activeJobsCount >= MAX_ACTIVE_JOBS}
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          <span>Add Job</span>
        </button>
      </div>

      {/* Job limit warning */}
      {activeJobsCount >= MAX_ACTIVE_JOBS * 0.8 && (
        <div className="bg-warning-50 border-l-4 border-warning-500 p-4 rounded-md">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-warning-500 mr-2" />
            <p className="text-warning-700">
              {activeJobsCount >= MAX_ACTIVE_JOBS 
                ? `Maximum job limit reached (${MAX_ACTIVE_JOBS}). Please complete or cancel existing jobs before adding new ones.`
                : `Approaching job limit: ${activeJobsCount}/${MAX_ACTIVE_JOBS} active jobs.`
              }
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1 bg-white">
            Filter by Status
          </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Printing">Printing</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div>
          <label htmlFor="operatorFilter" className="block text-sm font-medium text-gray-700 mb-1 bg-white">
            Filter by Operator
          </label>
          <select
            id="operatorFilter"
            value={filterOperator}
            onChange={(e) => setFilterOperator(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white"
          >
            <option value="all">All Operators</option>
            {operators.map(operator => (
              <option key={operator} value={operator}>{operator}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Print jobs table */}
      {filteredJobs && filteredJobs.length > 0 ? (
        <PrintJobTable 
          jobs={filteredJobs}
          parts={parts || []}
          onEditJob={handleEditJob}
          onDeleteJob={handleDeleteJob}
          onJobAction={handleJobAction}
        />
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">
            {printJobs.length === 0 
              ? 'No print jobs available.' 
              : 'No jobs match the selected filters.'
            }
          </p>
        </div>
      )}

      {/* Print job form modal */}
      <PrintJobFormModal
        job={isEditing ? selectedJob : null}
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        onSave={handleSaveJob}
        isEditing={isEditing}
        parts={parts || []}
      />
    </div>
  )
}

export default PrintQueue

// Made with Bob
