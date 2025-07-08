#!/usr/bin/env python3
"""
Generate mock print job data for the drone manufacturing logistics website.
"""

import json
import random
from datetime import datetime, timedelta
import os

# Ensure the output directory exists
os.makedirs('public/mock-data', exist_ok=True)

# Number of print jobs to generate
NUM_JOBS = 30

# Possible values for various fields
JOB_STATUSES = ["Pending", "Printing", "Paused", "Completed", "Failed"]
OPERATOR_IDS = ["OP-001", "OP-002", "OP-003", "OP-004", "OP-005", "OP-007", "OP-009"]

def load_parts_data():
    """Load parts data from the parts.json file."""
    try:
        with open('public/mock-data/parts.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Warning: parts.json not found. Run generate_parts.py first.")
        # Return some dummy part IDs if the file doesn't exist
        return [{"id": f"PART-{i:03d}"} for i in range(1, 21)]

def generate_random_date(start_days=7, end_days=0):
    """Generate a random date between start_days ago and end_days ago."""
    end_date = datetime.now() - timedelta(days=end_days)
    start_date = datetime.now() - timedelta(days=start_days)
    time_between_dates = end_date - start_date
    seconds_between_dates = time_between_dates.total_seconds()
    random_seconds = random.randrange(0, int(seconds_between_dates))
    return start_date + timedelta(seconds=random_seconds)

def generate_future_date(start_hours=0, end_hours=24):
    """Generate a random date in the future."""
    start_date = datetime.now() + timedelta(hours=start_hours)
    end_date = datetime.now() + timedelta(hours=end_hours)
    time_between_dates = end_date - start_date
    seconds_between_dates = time_between_dates.total_seconds()
    random_seconds = random.randrange(0, int(seconds_between_dates))
    return start_date + timedelta(seconds=random_seconds)

def generate_print_job(index, parts):
    """Generate a single print job with random data."""
    job_id = f"JOB-{index+1:04d}"
    
    # Select a random part
    part = random.choice(parts)
    part_id = part["id"]
    
    # Select a random operator
    operator_id = random.choice(OPERATOR_IDS)
    
    # Determine job status with weighted probabilities
    status_weights = [0.2, 0.15, 0.1, 0.4, 0.15]  # Pending, Printing, Paused, Completed, Failed
    status = random.choices(JOB_STATUSES, weights=status_weights, k=1)[0]
    
    # Generate timestamps based on status
    created_at = generate_random_date(7, 0)
    
    if status == "Pending":
        # Pending jobs don't have start time or estimated completion
        start_time = None
        estimated_completion = None
        updated_at = created_at
    elif status == "Printing":
        # Printing jobs started recently and will complete in the future
        start_time = generate_random_date(1, 0)
        # Print duration between 1 and 8 hours
        duration_hours = random.uniform(1, 8)
        estimated_completion = generate_future_date(0, duration_hours)
        updated_at = start_time
    elif status == "Paused":
        # Paused jobs started recently but were paused
        start_time = generate_random_date(2, 0)
        # Estimated completion is further in the future
        estimated_completion = generate_future_date(4, 12)
        updated_at = generate_random_date(1, 0)
    elif status == "Completed":
        # Completed jobs started and finished in the past
        start_time = generate_random_date(7, 1)
        # Print duration between 1 and 8 hours
        duration_hours = random.uniform(1, 8)
        estimated_completion = start_time + timedelta(hours=duration_hours)
        updated_at = estimated_completion
    else:  # Failed
        # Failed jobs started but didn't complete successfully
        start_time = generate_random_date(7, 1)
        estimated_completion = start_time + timedelta(hours=random.uniform(1, 8))
        # Failed before estimated completion
        updated_at = start_time + timedelta(hours=random.uniform(0.5, 0.9) * 
                                          ((estimated_completion - start_time).total_seconds() / 3600))
    
    # Convert datetime objects to ISO format strings
    created_at_iso = created_at.isoformat()
    updated_at_iso = updated_at.isoformat()
    start_time_iso = start_time.isoformat() if start_time else None
    estimated_completion_iso = estimated_completion.isoformat() if estimated_completion else None
    
    return {
        "id": job_id,
        "partId": part_id,
        "operatorId": operator_id,
        "status": status,
        "startTime": start_time_iso,
        "estimatedCompletion": estimated_completion_iso,
        "createdAt": created_at_iso,
        "updatedAt": updated_at_iso
    }

def generate_print_jobs_data():
    """Generate data for multiple print jobs."""
    # Load parts data
    parts = load_parts_data()
    
    # Generate print jobs
    jobs = [generate_print_job(i, parts) for i in range(NUM_JOBS)]
    
    # Write to JSON file
    output_file = 'public/mock-data/print_jobs.json'
    with open(output_file, 'w') as f:
        json.dump(jobs, f, indent=2)
    
    print(f"Generated {NUM_JOBS} print jobs and saved to {output_file}")

if __name__ == "__main__":
    generate_print_jobs_data()

# Made with Bob
