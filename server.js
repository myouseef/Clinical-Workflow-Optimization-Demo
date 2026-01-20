const express = require('express');
const path = require('path');
const { generatePatientData } = require('./simulation/generator');
const { simulateWorkflow } = require('./simulation/engine');
const { calculateMetrics } = require('./simulation/metrics');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'static')));

// Generate data on start (or per request if we wanted dynamic refresh)
const patients = generatePatientData(100);
const currentState = simulateWorkflow(patients, false);
const optimizedState = simulateWorkflow(patients, true);

// API Endpoint
app.get('/api/data', (req, res) => {
    const currentMetrics = calculateMetrics(currentState);
    const optimizedMetrics = calculateMetrics(optimizedState);

    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const data = {
        current_metrics: currentMetrics,
        optimized_metrics: optimizedMetrics,
        comparison_chart: {
            labels: ['Check-in', 'Wait', 'Encounter', 'Documentation', 'Total Lead Time'],
            current: [
                parseFloat(avg(currentState.map(r => r.checkin_duration)).toFixed(1)),
                parseFloat(avg(currentState.map(r => r.wait_duration)).toFixed(1)),
                parseFloat(avg(currentState.map(r => r.encounter_duration)).toFixed(1)),
                parseFloat(avg(currentState.map(r => r.documentation_duration)).toFixed(1)),
                parseFloat(avg(currentState.map(r => r.total_lead_time)).toFixed(1))
            ],
            optimized: [
                parseFloat(avg(optimizedState.map(r => r.checkin_duration)).toFixed(1)),
                parseFloat(avg(optimizedState.map(r => r.wait_duration)).toFixed(1)),
                parseFloat(avg(optimizedState.map(r => r.encounter_duration)).toFixed(1)),
                parseFloat(avg(optimizedState.map(r => r.documentation_duration)).toFixed(1)),
                parseFloat(avg(optimizedState.map(r => r.total_lead_time)).toFixed(1))
            ]
        }
    };

    res.json(data);
});

// Serve Dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'dashboard.html'));
});

// Since we are using sendFile for the HTML, we need to make sure the HTML 
// doesn't rely on Jinja2 template inheritance (block/extends).
// I will rewrite the HTML to be a single standalone file for simplicity in Node.js serving.

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
