#!/usr/bin/env python3
"""
Generate mock parts data for the drone manufacturing logistics website.
"""

import json
import random
from datetime import datetime, timedelta
import os

# Ensure the output directory exists
os.makedirs('public/mock-data', exist_ok=True)

# Number of parts to generate
NUM_PARTS = 20

# Possible values for various fields
PART_NAMES = [
    "Projector",
    "Motor Assembly",
    "Battery Pack",
    "Frame",
    "Propeller",
    "Camera Module",
    "GPS Sensor",
    "Flight Controller",
    "Power Distribution Board",
    "LED Light",
    "Landing Gear",
    "Antenna",
    "Gimbal",
    "ESC (Electronic Speed Controller)",
    "Receiver",
    "Transmitter",
    "Accelerometer",
    "Gyroscope",
    "Compass",
    "Barometer"
]

DESCRIPTIONS = [
    "High-resolution medical projector for precise imaging",
    "Brushless motor with integrated controller for efficient power delivery",
    "Lithium polymer battery pack with high energy density",
    "Carbon fiber frame providing lightweight structural support",
    "Self-balancing propeller with noise reduction technology",
    "4K camera module with image stabilization",
    "High-precision GPS sensor with GLONASS support",
    "Advanced flight controller with redundant systems",
    "Power distribution board with integrated voltage regulator",
    "High-brightness LED light array for night operations",
    "Shock-absorbing landing gear with auto-leveling",
    "Long-range communication antenna with signal amplifier",
    "3-axis stabilized gimbal for smooth camera movement",
    "Programmable electronic speed controller with cooling system",
    "Multi-channel receiver with interference protection",
    "Long-range transmitter with telemetry feedback",
    "High-sensitivity accelerometer for motion detection",
    "Precision gyroscope for orientation tracking",
    "Digital compass with automatic calibration",
    "Barometric pressure sensor for altitude measurement"
]

MATERIALS = [
    "Carbon Fiber",
    "Aluminum",
    "Plastic",
    "Glass",
    "Composite",
    "Silicon",
    "Copper",
    "Steel",
    "Titanium",
    "Fiberglass",
    "Nylon",
    "Rubber",
    "Ceramic",
    "Plastic & Glass",
    "Metal & Electronics"
]

STATUSES = ["Available", "In Stock", "Low Stock", "Out of Stock"]

def generate_random_date(start_days=60, end_days=1):
    """Generate a random date between start_days ago and end_days ago."""
    end_date = datetime.now() - timedelta(days=end_days)
    start_date = datetime.now() - timedelta(days=start_days)
    time_between_dates = end_date - start_date
    seconds_between_dates = time_between_dates.total_seconds()
    random_seconds = random.randrange(0, int(seconds_between_dates))
    return start_date + timedelta(seconds=random_seconds)

def generate_part(index):
    """Generate a single part with random data."""
    # Use index to ensure unique parts, but randomize the order
    part_name = PART_NAMES[index % len(PART_NAMES)]
    description = DESCRIPTIONS[index % len(DESCRIPTIONS)]
    
    # Generate a version number
    major = random.randint(1, 3)
    minor = random.randint(0, 9)
    version = f"v{major}.{minor}"
    
    # Generate inventory count based on status
    status = random.choice(STATUSES)
    if status == "Available":
        units = random.randint(50, 200)
    elif status == "In Stock":
        units = random.randint(20, 50)
    elif status == "Low Stock":
        units = random.randint(1, 20)
    else:  # Out of Stock
        units = 0
    
    # Generate created and updated dates
    created_at = generate_random_date(60, 10)
    updated_at = generate_random_date(10, 1)
    
    # Generate URLs for STL file and spec sheet
    stl_file_url = f"/models/{part_name.lower().replace(' ', '_')}.stl"
    spec_sheet_url = f"/specs/{part_name.lower().replace(' ', '_')}_spec.pdf"
    
    return {
        "id": f"PART-{index+1:03d}",
        "name": part_name,
        "description": description,
        "material": random.choice(MATERIALS),
        "status": status,
        "version": version,
        "unitsInInventory": units,
        "stlFileUrl": stl_file_url,
        "specSheetUrl": spec_sheet_url,
        "createdAt": created_at.isoformat(),
        "updatedAt": updated_at.isoformat()
    }

def generate_parts_data():
    """Generate data for multiple parts."""
    # Create a list of indices and shuffle them
    indices = list(range(NUM_PARTS))
    random.shuffle(indices)
    
    # Generate parts using the shuffled indices
    parts = [generate_part(i) for i in indices]
    
    # Write to JSON file
    output_file = 'public/mock-data/parts.json'
    with open(output_file, 'w') as f:
        json.dump(parts, f, indent=2)
    
    print(f"Generated {NUM_PARTS} parts and saved to {output_file}")

if __name__ == "__main__":
    generate_parts_data()

# Made with Bob
