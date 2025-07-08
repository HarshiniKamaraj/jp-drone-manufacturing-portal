#!/bin/bash
# Script to set up and run the Drone Manufacturing Logistics Website

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Drone Manufacturing Logistics Website ===${NC}"
echo -e "${YELLOW}Setting up the application...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js v16 or later.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm.${NC}"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}Python 3 is not installed. Mock data generation will not be available.${NC}"
    HAS_PYTHON=false
else
    HAS_PYTHON=true
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Create public/mock-data directory if it doesn't exist
mkdir -p public/mock-data

# Generate mock data if Python is available
if [ "$HAS_PYTHON" = true ]; then
    echo -e "${YELLOW}Generating mock data...${NC}"
    cd mock-data
    python3 generate_drones.py
    python3 generate_parts.py
    python3 generate_jobs.py
    cd ..
else
    echo -e "${YELLOW}Skipping mock data generation (Python not found).${NC}"
    echo -e "${YELLOW}You can still use the 'Import Mock Data' button in the app.${NC}"
fi

# Start the development server
echo -e "${GREEN}Starting the development server...${NC}"
echo -e "${GREEN}Open your browser and navigate to http://localhost:3000${NC}"
npm run dev

# Made with Bob
