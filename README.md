# Drone Manufacturing Logistics Website

A real-time monitoring, part management, and print job control system for an advanced drone production facility. This application streamlines production visibility, part access, and workflow management, enabling efficient factory operations.

## Features

### Dashboard (Live Monitoring)
- Real-time overview of all active drones within the factory
- Detailed telemetry and operational status
- Visual status indicators and alerts
- Expandable detailed view for each drone

### Parts Catalog
- Organized catalog of drone parts with technical specifications
- Downloadable 3D models (STL files)
- Add, edit, and delete parts
- Filter and sort functionality

### Print Queue / Control Panel
- Manage production print jobs queue
- Track job statuses and assign operators
- Control workflow with pause, resume, and cancel actions
- Enforce business rules like the 50-job limit

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Styling**: Tailwind CSS with DaisyUI
- **Local Storage**: IndexedDB with Dexie.js
- **Routing**: React Router v6
- **Charts**: Recharts
- **3D Model Viewer**: Three.js
- **Form Handling**: React Hook Form with Zod

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Python 3.6+ (for mock data generation)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/drone-manufacturing.git
   cd drone-manufacturing
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn
   ```

3. Generate mock data:
   ```
   cd mock-data
   python generate_drones.py
   python generate_parts.py
   python generate_jobs.py
   cd ..
   ```

4. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Mock Data Import

During development, you can use the "Import Mock Data" button that appears in the bottom-right corner of the screen to populate the IndexedDB with sample data.

## Project Structure

```
drone-manufacturing/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, fonts, etc.
│   ├── components/          # Shared UI components
│   │   ├── common/          # Buttons, inputs, etc.
│   │   ├── layout/          # Layout components
│   │   └── ui/              # Complex UI components
│   ├── features/            # Feature-based modules
│   │   ├── dashboard/       # Dashboard feature
│   │   ├── parts-catalog/   # Parts catalog feature
│   │   └── print-queue/     # Print queue feature
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API and service functions
│   │   └── db/              # IndexedDB service
│   ├── stores/              # Zustand stores
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main App component
│   ├── main.tsx             # Entry point
│   └── routes.tsx           # Route definitions
├── mock-data/               # Python scripts for mock data
├── .eslintrc.js             # ESLint configuration
├── .prettierrc              # Prettier configuration
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## Development

### Adding New Features

1. Create a new directory in the appropriate feature folder
2. Implement the feature components, hooks, and utilities
3. Update the routes if necessary
4. Add any required database schema changes to `dbService.ts`

### Building for Production

```
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

// Made with Bob
