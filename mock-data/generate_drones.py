#!/usr/bin/env python3
"""
Generate mock drone data for the drone manufacturing logistics website.
"""

import json
import random
from datetime import datetime, timedelta
import os

# Ensure the output directory exists
os.makedirs('public/mock-data', exist_ok=True)

# Number of drones to generate
NUM_DRONES = 10

# Possible values for various fields
SYSTEM_STATUSES = ["Active", "Idle", "Error"]
CHARGING_STATUSES = ["Charging", "Not Charging"]
MISSION_STATUSES = ["In Progress", "Standby", "Complete", "Error"]
CURRENT_TASKS = [
    "Calibrating sensors",
    "Running diagnostics",
    "Awaiting instructions",
    "Charging battery",
    "Updating firmware",
    "Performing self-test",
    "Scanning environment",
    "Processing data",
    "Executing mission plan",
    "Returning to base"
]
ALERT_TYPES = ["warning", "error", "info"]
ALERT_MESSAGES = [
    "Low battery",
    "Motor overheat",
    "Sensor malfunction",
    "Communication delay",
    "GPS signal weak",
    "Firmware update required",
    "Obstacle detected",
    "Weather conditions suboptimal",
    "Critical battery level",
    "System reboot required"
]
HISTORY_EVENTS = [
    "System boot",
    "Calibration started",
    "Calibration completed",
    "Mission started",
    "Mission completed",
    "Error detected",
    "System shutdown",
    "Maintenance performed",
    "Battery replaced",
    "Firmware updated"
]

def generate_random_date(start_days=2, end_days=0):
    """Generate a random date between start_days ago and end_days ago."""
    end_date = datetime.now() - timedelta(days=end_days)
    start_date = datetime.now() - timedelta(days=start_days)
    time_between_dates = end_date - start_date
    seconds_between_dates = time_between_dates.total_seconds()
    random_seconds = random.randrange(0, int(seconds_between_dates))
    return start_date + timedelta(seconds=random_seconds)

def generate_drone():
    """Generate a single drone with random data."""
    drone_id = f"DR-{random.randint(1, 999):03d}"
    battery_level = random.randint(5, 100)
    charging_status = random.choice(CHARGING_STATUSES)
    system_status = random.choice(SYSTEM_STATUSES)
    current_task = random.choice(CURRENT_TASKS)
    
    # Generate between 0 and 3 alerts
    num_alerts = random.randint(0, 3) if system_status == "Error" else random.randint(0, 1)
    alerts = []
    for _ in range(num_alerts):
        alert_type = "error" if system_status == "Error" else random.choice(ALERT_TYPES)
        alerts.append({
            "type": alert_type,
            "message": random.choice(ALERT_MESSAGES),
            "timestamp": generate_random_date(1, 0).isoformat()
        })
    
    # Generate between 2 and 5 history events
    num_history = random.randint(2, 5)
    history = []
    for i in range(num_history):
        history.append({
            "event": random.choice(HISTORY_EVENTS),
            "timestamp": generate_random_date(2, 1).isoformat()
        })
    
    # Sort history by timestamp
    history.sort(key=lambda x: x["timestamp"])
    
    # Generate temperature based on system status
    if system_status == "Error":
        temperature = random.uniform(50.0, 65.0)
    elif system_status == "Active":
        temperature = random.uniform(35.0, 50.0)
    else:
        temperature = random.uniform(20.0, 35.0)
    
    # Generate GPS location (around San Francisco for example)
    base_lat, base_lon = 37.7749, -122.4194
    gps_location = {
        "latitude": base_lat + random.uniform(-0.01, 0.01),
        "longitude": base_lon + random.uniform(-0.01, 0.01)
    }
    
    # Generate mission status based on system status
    if system_status == "Error":
        mission_status = "Error"
    elif system_status == "Active":
        mission_status = "In Progress"
    else:
        mission_status = random.choice(["Standby", "Complete"])
    
    return {
        "id": drone_id,
        "batteryLevel": battery_level,
        "chargingStatus": charging_status,
        "systemStatus": system_status,
        "currentTask": current_task,
        "alerts": alerts,
        "lastUpdate": datetime.now().isoformat(),
        "temperature": round(temperature, 1),
        "gpsLocation": gps_location,
        "missionStatus": mission_status,
        "history": history
    }

def generate_drones_data():
    """Generate data for multiple drones."""
    drones = [generate_drone() for _ in range(NUM_DRONES)]
    
    # Write to JSON file
    output_file = 'public/mock-data/drones.json'
    with open(output_file, 'w') as f:
        json.dump(drones, f, indent=2)
    
    print(f"Generated {NUM_DRONES} drones and saved to {output_file}")

if __name__ == "__main__":
    generate_drones_data()

# Made with Bob
