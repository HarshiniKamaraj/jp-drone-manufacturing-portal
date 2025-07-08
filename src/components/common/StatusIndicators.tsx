import { FC } from 'react'

// Battery Icon Component
interface BatteryIconProps {
  level: number
  charging: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const BatteryIcon: FC<BatteryIconProps> = ({ 
  level, 
  charging, 
  size = 'md' 
}) => {
  // Determine battery color based on level
  let fillColor = 'fill-success-500'
  if (level <= 20) {
    fillColor = 'fill-error-500'
  } else if (level <= 50) {
    fillColor = 'fill-warning-500'
  }

  // Determine size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <div className="relative">
      {/* Battery icon */}
      <svg 
        className={`${sizeClasses[size]}`} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect 
          x="2" 
          y="6" 
          width="18" 
          height="12" 
          rx="2" 
          stroke="currentColor" 
          strokeWidth="2" 
          className="text-gray-400"
        />
        <rect 
          x="4" 
          y="8" 
          width={`${Math.max(0, Math.min(14, level * 14 / 100))}`} 
          height="8" 
          className={fillColor}
        />
        <rect 
          x="22" 
          y="10" 
          width="2" 
          height="4" 
          rx="1" 
          fill="currentColor" 
          className="text-gray-400"
        />
      </svg>
      
      {/* Charging indicator */}
      {charging && (
        <div className="absolute -top-1 -right-1">
          <svg 
            className="w-3 h-3 text-success-500" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      )}
    </div>
  )
}

// Status Badge Component
interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md' | 'lg'
}

export const StatusBadge: FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md' 
}) => {
  // Determine badge color based on status
  let badgeClasses = ''
  
  switch (status.toLowerCase()) {
    case 'active':
      badgeClasses = 'bg-success-100 text-success-800'
      break
    case 'idle':
      badgeClasses = 'bg-warning-100 text-warning-800'
      break
    case 'error':
      badgeClasses = 'bg-error-100 text-error-800'
      break
    case 'pending':
      badgeClasses = 'bg-blue-100 text-blue-800'
      break
    case 'printing':
      badgeClasses = 'bg-purple-100 text-purple-800'
      break
    case 'paused':
      badgeClasses = 'bg-orange-100 text-orange-800'
      break
    case 'completed':
      badgeClasses = 'bg-green-100 text-green-800'
      break
    case 'failed':
      badgeClasses = 'bg-red-100 text-red-800'
      break
    default:
      badgeClasses = 'bg-gray-100 text-gray-800'
  }

  // Determine size classes
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-1'
  }

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${badgeClasses} ${sizeClasses[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status.toLowerCase() === 'active' ? 'bg-success-500' : status.toLowerCase() === 'idle' ? 'bg-warning-500' : 'bg-error-500'}`}></span>
      {status}
    </span>
  )
}

// Made with Bob
