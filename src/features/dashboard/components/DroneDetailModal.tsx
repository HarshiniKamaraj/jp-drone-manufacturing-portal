import { FC } from 'react'
import { Drone } from '@services/db/dbService'
import { StatusBadge } from '@components/common/StatusIndicators'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

interface DroneDetailModalProps {
  drone: Drone
  isOpen: boolean
  onClose: () => void
}

const DroneDetailModal: FC<DroneDetailModalProps> = ({ drone, isOpen, onClose }) => {
  if (!isOpen) return null

  // Format timestamp for display
  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date)
  }

  // Generate mock temperature data for the chart
  const generateTemperatureData = () => {
    const data = []
    const now = new Date()
    
    for (let i = 30; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000) // Every minute
      const baseTemp = drone.temperature
      const randomVariation = Math.random() * 2 - 1 // Random variation between -1 and 1
      
      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: parseFloat((baseTemp + randomVariation).toFixed(1))
      })
    }
    
    return data
  }

  const temperatureData = generateTemperatureData()

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-gray-800 mr-3">{drone.id}</h2>
            <StatusBadge status={drone.systemStatus} size="lg" />
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
            {/* Left column */}
            <div className="space-y-6">
              {/* Basic info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Battery Level</p>
                    <p className="text-base font-medium">{drone.batteryLevel}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Charging Status</p>
                    <p className="text-base font-medium">{drone.chargingStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Task</p>
                    <p className="text-base font-medium">{drone.currentTask}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mission Status</p>
                    <p className="text-base font-medium">{drone.missionStatus}</p>
                  </div>
                </div>
              </div>

              {/* Temperature chart */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Temperature History</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={temperatureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }} 
                        interval={4}
                      />
                      <YAxis 
                        domain={[
                          Math.floor(Math.min(...temperatureData.map(d => d.temperature)) - 2),
                          Math.ceil(Math.max(...temperatureData.map(d => d.temperature)) + 2)
                        ]}
                        tick={{ fontSize: 12 }}
                        label={{ value: '°C', angle: -90, position: 'insideLeft', fontSize: 12 }}
                      />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#0ea5e9" 
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* GPS Location */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">GPS Location</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Latitude</p>
                    <p className="text-base font-medium">{drone.gpsLocation.latitude.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Longitude</p>
                    <p className="text-base font-medium">{drone.gpsLocation.longitude.toFixed(6)}</p>
                  </div>
                </div>
                <div className="mt-3 bg-gray-200 h-40 rounded flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Map visualization would go here</p>
                </div>
              </div>

              {/* Alerts */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Alerts</h3>
                {drone.alerts.length === 0 ? (
                  <p className="text-gray-500">No active alerts</p>
                ) : (
                  <div className="space-y-2">
                    {drone.alerts.map((alert, index) => (
                      <div 
                        key={index} 
                        className={`p-2 rounded-md ${
                          alert.type === 'error' ? 'bg-error-100 text-error-800' : 
                          alert.type === 'warning' ? 'bg-warning-100 text-warning-800' : 
                          'bg-info-100 text-info-800'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{alert.message}</span>
                          <span className="text-xs">{formatTimestamp(alert.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Event History */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Event History</h3>
                <div className="space-y-3">
                  {drone.history.map((event, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-4 w-4 mt-0.5">
                        <div className="h-full w-0.5 bg-gray-300 mx-auto"></div>
                        <div className="h-2 w-2 rounded-full bg-primary-500 mx-auto"></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{event.event}</p>
                        <p className="text-xs text-gray-500">{formatTimestamp(event.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Last update: {formatTimestamp(drone.lastUpdate)}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button 
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Send Command
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DroneDetailModal

// Made with Bob
