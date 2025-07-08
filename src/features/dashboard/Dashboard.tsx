import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import db, { Drone } from '@services/db/dbService'
import DroneCard from './components/DroneCard'
import DroneDetailModal from './components/DroneDetailModal'

const Dashboard = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Query drones from IndexedDB
  const drones = useLiveQuery(() => db.drones.toArray())

  // Simulate real-time updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (drones && drones.length > 0) {
        // Update a random drone with new data
        const randomIndex = Math.floor(Math.random() * drones.length)
        const droneToUpdate = drones[randomIndex]
        
        // Update battery level (randomly increase or decrease by 0-2%)
        const batteryDelta = Math.floor(Math.random() * 3) * (Math.random() > 0.5 ? 1 : -1)
        let newBatteryLevel = droneToUpdate.batteryLevel + batteryDelta
        newBatteryLevel = Math.max(0, Math.min(100, newBatteryLevel))
        
        // Update temperature (randomly fluctuate by 0-0.5 degrees)
        const tempDelta = Math.random() * 0.5 * (Math.random() > 0.5 ? 1 : -1)
        const newTemp = parseFloat((droneToUpdate.temperature + tempDelta).toFixed(1))
        
        // Update the drone in the database
        db.drones.update(droneToUpdate.id, {
          batteryLevel: newBatteryLevel,
          temperature: newTemp,
          lastUpdate: new Date()
        })
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(updateInterval)
  }, [drones])

  const handleDroneClick = (drone: Drone) => {
    setSelectedDrone(drone)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedDrone(null)
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid')
  }

  if (!drones) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Live Drone Monitoring</h1>
        <div className="flex space-x-2">
          <button
            onClick={toggleViewMode}
            className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </button>
        </div>
      </div>

      {drones.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No drones available for monitoring.</p>
        </div>
      ) : (
        <div className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
            : 'space-y-4'
          }
        `}>
          {drones.map(drone => (
            <DroneCard 
              key={drone.id} 
              drone={drone} 
              onClick={() => handleDroneClick(drone)}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {selectedDrone && (
        <DroneDetailModal 
          drone={selectedDrone} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />
      )}
    </div>
  )
}

export default Dashboard

// Made with Bob
