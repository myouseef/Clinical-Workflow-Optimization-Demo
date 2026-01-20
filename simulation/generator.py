import pandas as pd
import numpy as np
from faker import Faker
from datetime import datetime, timedelta
import random

fake = Faker()

def generate_patient_data(num_patients=50, random_seed=42):
    random.seed(random_seed)
    np.random.seed(random_seed)
    Faker.seed(random_seed)

    patients = []
    
    # Base start time for the day (8:00 AM)
    base_time = datetime.now().replace(hour=8, minute=0, second=0, microsecond=0)

    for i in range(num_patients):
        # Stagger arrival times
        arrival_bias = i * random.randint(5, 15) # minutes between arrivals
        arrival_time = base_time + timedelta(minutes=arrival_bias)
        
        patient = {
            'patient_id': fake.uuid4()[:8],
            'name': fake.name(),
            'age': random.randint(18, 90),
            'condition': random.choice(['Routine Checkup', 'Flu Symptoms', 'Hypertension', 'Diabetes Follow-up', 'Acute Pain']),
            'arrival_time': arrival_time,
            'appointment_scheduled': arrival_time - timedelta(days=random.randint(1, 14))
        }
        patients.append(patient)
    
    return pd.DataFrame(patients)
