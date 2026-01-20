function calculateMetrics(simResults) {
    const sum = (arr) => arr.reduce((a, b) => a + b, 0);
    const avg = (arr) => arr.length ? sum(arr) / arr.length : 0;

    const leadTimes = simResults.map(r => r.total_lead_time);
    const waitTimes = simResults.map(r => r.wait_duration);
    const docTimes = simResults.map(r => r.documentation_duration);
    const valueAddedTimes = simResults.map(r => r.value_added_time);

    return {
        avg_lead_time: parseFloat(avg(leadTimes).toFixed(1)),
        avg_wait_time: parseFloat(avg(waitTimes).toFixed(1)),
        avg_doc_time: parseFloat(avg(docTimes).toFixed(1)),
        process_efficiency: parseFloat(((sum(valueAddedTimes) / sum(leadTimes)) * 100).toFixed(1)),
        bottleneck_score: {
            'Waiting Room': parseFloat(avg(waitTimes).toFixed(1)),
            'Documentation': parseFloat(avg(docTimes).toFixed(1))
        }
    };
}

module.exports = { calculateMetrics };
