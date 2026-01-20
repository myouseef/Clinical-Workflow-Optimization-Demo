import pandas as pd

def calculate_kpis(sim_df):
    """
    Calculates operational KPIs from the simulation results.
    """
    metrics = {
        'avg_lead_time': round(sim_df['total_lead_time'].mean(), 1),
        'avg_wait_time': round(sim_df['wait_duration'].mean(), 1),
        'avg_doc_time': round(sim_df['documentation_duration'].mean(), 1),
        'process_efficiency': round((sim_df['value_added_time'].sum() / sim_df['total_lead_time'].sum()) * 100, 1),
        'bottleneck_score': {
            'Waiting Room': round(sim_df['wait_duration'].mean(), 1),
            'Documentation': round(sim_df['documentation_duration'].mean(), 1)
        }
    }
    return metrics
