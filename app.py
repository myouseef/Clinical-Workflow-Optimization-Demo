from flask import Flask, render_template, jsonify
from simulation.generator import generate_patient_data
from simulation.engine import simulate_workflow
from simulation.metrics import calculate_kpis
import pandas as pd

app = Flask(__name__)

# Run simulation once on startup (or could be per request)
# For the demo, we generate data fresh on load or via API
patients_df = generate_patient_data(num_patients=100)
current_state_df = simulate_workflow(patients_df, is_optimized=False)
optimized_state_df = simulate_workflow(patients_df, is_optimized=True)

@app.route('/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/data')
def get_data():
    # Calculate Metrics
    current_metrics = calculate_kpis(current_state_df)
    optimized_metrics = calculate_kpis(optimized_state_df)
    
    # Prepare data for charts
    # Comparison of Average times
    comparison_data = {
        'labels': ['Check-in', 'Wait', 'Encounter', 'Documentation', 'Total Lead Time'],
        'current': [
            round(current_state_df['checkin_duration'].mean(), 1),
            round(current_state_df['wait_duration'].mean(), 1),
            round(current_state_df['encounter_duration'].mean(), 1),
            round(current_state_df['documentation_duration'].mean(), 1),
            round(current_state_df['total_lead_time'].mean(), 1)
        ],
        'optimized': [
            round(optimized_state_df['checkin_duration'].mean(), 1),
            round(optimized_state_df['wait_duration'].mean(), 1),
            round(optimized_state_df['encounter_duration'].mean(), 1),
            round(optimized_state_df['documentation_duration'].mean(), 1),
            round(optimized_state_df['total_lead_time'].mean(), 1)
        ]
    }
    
    return jsonify({
        'current_metrics': current_metrics,
        'optimized_metrics': optimized_metrics,
        'comparison_chart': comparison_data
    })

if __name__ == '__main__':
    app.run(debug=True)
