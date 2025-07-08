import Dexie, { Table } from 'dexie'

// Define interfaces for our database tables
export interface Drone {
  id: string
  batteryLevel: number
  chargingStatus: string
  systemStatus: string
  currentTask: string
  alerts: Array<{ type: string; message: string; timestamp: Date }>
  lastUpdate: Date
  temperature: number
  gpsLocation: { latitude: number; longitude: number }
  missionStatus: string
  history: Array<{ event: string; timestamp: Date }>
}

export interface Part {
  id?: string
  name: string
  description: string
  material: string
  status: string
  version: string
  unitsInInventory: number
  stlFileUrl: string
  specSheetUrl: string
  createdAt: Date
  updatedAt: Date
}

export interface PrintJob {
  id?: string
  partId: string
  operatorId: string
  status: string
  startTime?: Date
  estimatedCompletion?: Date
  createdAt: Date
  updatedAt: Date
}

// Define our database
class DroneManufacturingDB extends Dexie {
  drones!: Table<Drone>
  parts!: Table<Part>
  printJobs!: Table<PrintJob>

  constructor() {
    super('DroneManufacturingDB')
    this.version(1).stores({
      drones: 'id, systemStatus, lastUpdate',
      parts: '++id, name, material, status, version',
      printJobs: '++id, partId, operatorId, status, startTime, createdAt'
    })
  }
}

// Create a database instance
const db = new DroneManufacturingDB()

// Initialize the database with sample data if empty
export async function initializeDatabase() {
  const droneCount = await db.drones.count()
  const partsCount = await db.parts.count()
  const printJobsCount = await db.printJobs.count()

  if (droneCount === 0) {
    console.log('Initializing drones table with sample data...')
    await addSampleDrones()
  }

  if (partsCount === 0) {
    console.log('Initializing parts table with sample data...')
    await addSampleParts()
  }

  if (printJobsCount === 0) {
    console.log('Initializing print jobs table with sample data...')
    await addSamplePrintJobs()
  }

  return db
}

// Sample data functions
async function addSampleDrones() {
  const sampleDrones: Drone[] = [
    {
      id: 'DR-001',
      batteryLevel: 78,
      chargingStatus: 'Charging',
      systemStatus: 'Active',
      currentTask: 'Calibrating sensors',
      alerts: [],
      lastUpdate: new Date(),
      temperature: 42.5,
      gpsLocation: { latitude: 37.7749, longitude: -122.4194 },
      missionStatus: 'In Progress',
      history: [
        { event: 'System boot', timestamp: new Date(Date.now() - 3600000) },
        { event: 'Calibration started', timestamp: new Date(Date.now() - 1800000) }
      ]
    },
    {
      id: 'DR-002',
      batteryLevel: 45,
      chargingStatus: 'Not Charging',
      systemStatus: 'Idle',
      currentTask: 'Awaiting instructions',
      alerts: [
        { type: 'warning', message: 'Low battery', timestamp: new Date() }
      ],
      lastUpdate: new Date(),
      temperature: 38.2,
      gpsLocation: { latitude: 37.7748, longitude: -122.4193 },
      missionStatus: 'Standby',
      history: [
        { event: 'System boot', timestamp: new Date(Date.now() - 7200000) },
        { event: 'Mission completed', timestamp: new Date(Date.now() - 3600000) }
      ]
    },
    {
      id: 'DR-003',
      batteryLevel: 12,
      chargingStatus: 'Charging',
      systemStatus: 'Error',
      currentTask: 'System diagnostic',
      alerts: [
        { type: 'error', message: 'Motor overheat', timestamp: new Date() },
        { type: 'error', message: 'Critical battery level', timestamp: new Date() }
      ],
      lastUpdate: new Date(),
      temperature: 58.7,
      gpsLocation: { latitude: 37.7750, longitude: -122.4195 },
      missionStatus: 'Error',
      history: [
        { event: 'System boot', timestamp: new Date(Date.now() - 5400000) },
        { event: 'Error detected', timestamp: new Date(Date.now() - 1200000) }
      ]
    }
  ]

  await db.drones.bulkAdd(sampleDrones)
}

async function addSampleParts() {
  const sampleParts: Part[] = [
    {
      name: 'Projector',
      description: 'High-resolution medical projector',
      material: 'Plastic & Glass',
      status: 'Available',
      version: 'v1.2',
      unitsInInventory: 150,
      stlFileUrl: '/models/projector.stl',
      specSheetUrl: '/specs/projector_spec.pdf',
      createdAt: new Date(Date.now() - 7200000),
      updatedAt: new Date(Date.now() - 3600000)
    },
    {
      name: 'Motor Assembly',
      description: 'Brushless motor with controller',
      material: 'Metal & Electronics',
      status: 'In Stock',
      version: 'v2.0',
      unitsInInventory: 75,
      stlFileUrl: '/models/motor.stl',
      specSheetUrl: '/specs/motor_spec.pdf',
      createdAt: new Date(Date.now() - 14400000),
      updatedAt: new Date(Date.now() - 7200000)
    },
    {
      name: 'Battery Pack',
      description: 'Lithium polymer battery pack',
      material: 'Electronics',
      status: 'Low Stock',
      version: 'v1.5',
      unitsInInventory: 25,
      stlFileUrl: '/models/battery.stl',
      specSheetUrl: '/specs/battery_spec.pdf',
      createdAt: new Date(Date.now() - 21600000),
      updatedAt: new Date(Date.now() - 10800000)
    },
    {
      name: 'Frame',
      description: 'Main drone frame',
      material: 'Carbon Fiber',
      status: 'Available',
      version: 'v3.1',
      unitsInInventory: 100,
      stlFileUrl: '/models/frame.stl',
      specSheetUrl: '/specs/frame_spec.pdf',
      createdAt: new Date(Date.now() - 28800000),
      updatedAt: new Date(Date.now() - 14400000)
    }
  ]

  await db.parts.bulkAdd(sampleParts)
}

async function addSamplePrintJobs() {
  // Get some part IDs from the database
  const parts = await db.parts.toArray()
  const partIds = parts.map(part => part.id).filter(Boolean) as string[]

  if (partIds.length === 0) {
    console.error('No parts found in database for print jobs')
    return
  }

  const samplePrintJobs: PrintJob[] = [
    {
      partId: partIds[0],
      operatorId: 'OP-001',
      status: 'Printing',
      startTime: new Date(Date.now() - 1800000),
      estimatedCompletion: new Date(Date.now() + 1800000),
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date()
    },
    {
      partId: partIds[1],
      operatorId: 'OP-002',
      status: 'Pending',
      createdAt: new Date(Date.now() - 7200000),
      updatedAt: new Date(Date.now() - 7200000)
    },
    {
      partId: partIds[2],
      operatorId: 'OP-001',
      status: 'Completed',
      startTime: new Date(Date.now() - 10800000),
      estimatedCompletion: new Date(Date.now() - 3600000),
      createdAt: new Date(Date.now() - 14400000),
      updatedAt: new Date(Date.now() - 3600000)
    },
    {
      partId: partIds[0],
      operatorId: 'OP-003',
      status: 'Failed',
      startTime: new Date(Date.now() - 21600000),
      estimatedCompletion: new Date(Date.now() - 18000000),
      createdAt: new Date(Date.now() - 25200000),
      updatedAt: new Date(Date.now() - 18000000)
    }
  ]

  await db.printJobs.bulkAdd(samplePrintJobs)
}

export default db

// Made with Bob
