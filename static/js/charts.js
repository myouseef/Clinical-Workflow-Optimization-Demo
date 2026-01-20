document.addEventListener('DOMContentLoaded', function () {
    fetchData();
});

async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();

        renderMetrics(data);
        renderCharts(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('metrics-display').innerHTML = '<p class="error">Failed to load data.</p>';
    }
}

function renderMetrics(data) {
    const container = document.getElementById('metrics-display');
    const cur = data.current_metrics;
    const opt = data.optimized_metrics;

    // Calculate percent improvements
    const improveWait = Math.round(((cur.avg_wait_time - opt.avg_wait_time) / cur.avg_wait_time) * 100);
    const improveDoc = Math.round(((cur.avg_doc_time - opt.avg_doc_time) / cur.avg_doc_time) * 100);
    const improveLead = Math.round(((cur.avg_lead_time - opt.avg_lead_time) / cur.avg_lead_time) * 100);

    const html = `
        <div class="metrics-row">
            <span class="metric-label">Avg Lead Time (Total Request->Done)</span>
            <div>
                <span class="metric-value">${cur.avg_lead_time}m</span> 
                <span class="arrow">→</span> 
                <span class="metric-value">${opt.avg_lead_time}m</span>
                <span class="positive-change">(${improveLead}% Faster)</span>
            </div>
        </div>
        <div class="metrics-row">
            <span class="metric-label">Avg Waiting Room Time</span>
            <div>
                <span class="metric-value">${cur.avg_wait_time}m</span> 
                <span class="arrow">→</span> 
                <span class="metric-value">${opt.avg_wait_time}m</span>
                <span class="positive-change">(${improveWait}% Less Wait)</span>
            </div>
        </div>
        <div class="metrics-row">
            <span class="metric-label">Avg Documentation Time</span>
            <div>
                <span class="metric-value">${cur.avg_doc_time}m</span> 
                <span class="arrow">→</span> 
                <span class="metric-value">${opt.avg_doc_time}m</span>
                <span class="positive-change">(${improveDoc}% More Efficient)</span>
            </div>
        </div>
        <div class="metrics-row">
            <span class="metric-label">Process Efficiency (Value Add)</span>
            <div>
                <span class="metric-value">${cur.process_efficiency}%</span> 
                <span class="arrow">→</span> 
                <span class="metric-value">${opt.process_efficiency}%</span>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function renderCharts(data) {
    const ctx = document.getElementById('impactChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.comparison_chart.labels,
            datasets: [
                {
                    label: 'Current State (Avg Mins)',
                    data: data.comparison_chart.current,
                    backgroundColor: 'rgba(220, 53, 69, 0.7)', // Red for bottlenecks
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Optimized State (Avg Mins)',
                    data: data.comparison_chart.optimized,
                    backgroundColor: 'rgba(40, 167, 69, 0.7)', // Green for improved
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Minutes'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Process Step Duration Comparison'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}
