import { FC } from 'react'
import { Drone } from '@services/db/dbService'
import { BatteryIcon, StatusBadge } from '@components/common/StatusIndicators'

interface DroneCardProps {
  drone: Drone
  onClick: () => void
  viewMode: 'grid' | 'list'
}

const DroneCard: FC<DroneCardProps> = ({ drone, onClick, viewMode }) => {
  // Format the last update time
  const formatLastUpdate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date)
  }

  // Determine if there are any alerts
  const hasAlerts = drone.alerts && drone.alerts.length > 0
  
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all
        hover:shadow-lg border-l-4 
        ${drone.systemStatus === 'Active' ? 'border-success-500' : 
          drone.systemStatus === 'Idle' ? 'border-warning-500' : 'border-error-500'}
        ${viewMode === 'list' ? 'flex' : ''}
      `}
      onClick={onClick}
    >
      {/* Header with ID and status */}
      <div className={`
        p-4 ${viewMode === 'list' ? 'w-1/4 border-r border-gray-100' : 'border-b border-gray-100'}
      `}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{drone.id}</h3>
          <StatusBadge status={drone.systemStatus} />
        </div>
      </div>

      {/* Body with details */}
      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className={`${viewMode === 'list' ? 'flex justify-between' : 'space-y-3'}`}>
          {/* Battery and charging status */}
          <div className="flex items-center">
            <BatteryIcon level={drone.batteryLevel} charging={drone.chargingStatus === 'Charging'} />
            <span className="ml-2 text-sm text-gray-600">{drone.batteryLevel}%</span>
            {drone.chargingStatus === 'Charging' && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                Charging
              </span>
            )}
          </div>

          {/* Current task */}
          <div className={`${viewMode === 'list' ? '' : 'mt-3'}`}>
            <span className="text-xs text-gray-500">CURRENT TASK</span>
            <p className="text-sm font-medium text-gray-700">{drone.currentTask}</p>
          </div>

          {/* Alerts */}
          <div className={`${viewMode === 'list' ? '' : 'mt-3'}`}>
            {hasAlerts ? (
              <div className="flex items-center">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-error-500"></span>
                </span>
                <span className="ml-2 text-sm text-error-700">
                  {drone.alerts.length} {drone.alerts.length === 1 ? 'Alert' : 'Alerts'}
                </span>
              </div>
            ) : (
              <span className="text-sm text-success-700">No Alerts</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer with last update */}
      <div className={`
        bg-gray-50 px-4 py-2 text-xs text-gray-500
        ${viewMode === 'list' ? 'w-1/5 flex items-center justify-center' : ''}
      `}>
        Last update: {formatLastUpdate(drone.lastUpdate)}
      </div>
    </div>
  )
}

export default DroneCard

// Made with Bob
