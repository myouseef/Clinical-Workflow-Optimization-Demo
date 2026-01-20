import pandas as pd
import numpy as np
from datetime import timedelta

def simulate_workflow(df, is_optimized=False):
    """
    Simulates the workflow: Appointment -> Encounter -> Documentation
    
    If is_optimized=True, we apply Lean improvements:
    - Reduced check-in time (e.g., self-service kiosk)
    - Standardized documentation templates (faster documentation)
    - Better resource allocation (reduced wait times)
    """
    
    # Parameters (Mean duration in minutes, Std Dev)
    # Scenario: Current State vs Optimized State
    if not is_optimized:
        # Current State: Inefficiencies present
        checkin_time_params = (10, 3) 
        wait_for_room_params = (25, 10) # Bottleneck!
        encounter_params = (15, 5)
        doc_params = (12, 4) # Bottleneck!
    else:
        # Lean State: Improvements applied
        checkin_time_params = (2, 1) # Self-checkin
        wait_for_room_params = (5, 2) # Better flow
        encounter_params = (15, 5) # Value-added time usually stays similar
        doc_params = (5, 2) # Templates/Scribes
    
    results = []
    
    # We assign resources to simulate simple queuing if needed, 
    # but for this demo, we'll calculate times based on distributions 
    # to show the tracking logic clearly.
    
    for _, row in df.iterrows():
        # 1. Arrival -> Check-in
        checkin_dur = max(1, np.random.normal(*checkin_time_params))
        checkin_end = row['arrival_time'] + timedelta(minutes=checkin_dur)
        
        # 2. Waiting Room -> Encounter Start
        # In a real event sim, this would depend on previous patient. 
        # Here we add random wait plus a cumulative drift if it's busy, 
        # but let's keep it simple: just the "process time" concept.
        wait_dur = max(0, np.random.normal(*wait_for_room_params))
        encounter_start = checkin_end + timedelta(minutes=wait_dur)
        
        # 3. Encounter
        encounter_dur = max(5, np.random.normal(*encounter_params))
        encounter_end = encounter_start + timedelta(minutes=encounter_dur)
        
        # 4. Documentation
        doc_dur = max(2, np.random.normal(*doc_params))
        doc_end = encounter_end + timedelta(minutes=doc_dur)
        
        results.append({
            'patient_id': row['patient_id'],
            'checkin_duration': round(checkin_dur, 1),
            'wait_duration': round(wait_dur, 1),
            'encounter_duration': round(encounter_dur, 1),
            'documentation_duration': round(doc_dur, 1),
            'total_lead_time': round((doc_end - row['arrival_time']).total_seconds() / 60, 1),
            'value_added_time': round(encounter_dur, 1), # Only the consult is "Value Added" in strict Lean terms
            'simulation_type': 'Optimized' if is_optimized else 'Current State'
        })
        
    return pd.DataFrame(results)
