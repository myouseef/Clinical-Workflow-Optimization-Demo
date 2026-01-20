function simulateWorkflow(patients, isOptimized = false) {
    // Parameters (Mean duration in minutes, Std Dev)
    let checkinTimeParams, waitForRoomParams, encounterParams, docParams;

    if (!isOptimized) {
        // Current State: Inefficiencies present
        checkinTimeParams = { mean: 10, std: 3 };
        waitForRoomParams = { mean: 25, std: 10 }; // Bottleneck!
        encounterParams = { mean: 15, std: 5 };
        docParams = { mean: 12, std: 4 }; // Bottleneck!
    } else {
        // Lean State: Improvements applied
        checkinTimeParams = { mean: 2, std: 1 }; // Self-checkin
        waitForRoomParams = { mean: 5, std: 2 }; // Better flow
        encounterParams = { mean: 15, std: 5 };
        docParams = { mean: 5, std: 2 }; // Templates/Scribes
    }

    // Helper for box-muller transform (Normal distribution)
    function randomNormal(mean, std) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return (num * std) + mean;
    }

    const results = patients.map(patient => {
        // 1. Arrival -> Check-in
        const checkinDur = Math.max(1, randomNormal(checkinTimeParams.mean, checkinTimeParams.std));
        const checkinEnd = new Date(patient.arrival_time.getTime() + checkinDur * 60000);

        // 2. Waiting Room -> Encounter Start
        const waitDur = Math.max(0, randomNormal(waitForRoomParams.mean, waitForRoomParams.std));
        const encounterStart = new Date(checkinEnd.getTime() + waitDur * 60000);

        // 3. Encounter
        const encounterDur = Math.max(5, randomNormal(encounterParams.mean, encounterParams.std));
        const encounterEnd = new Date(encounterStart.getTime() + encounterDur * 60000);

        // 4. Documentation
        const docDur = Math.max(2, randomNormal(docParams.mean, docParams.std));
        const docEnd = new Date(encounterEnd.getTime() + docDur * 60000);

        const totalLeadTime = (docEnd - patient.arrival_time) / 60000; // minutes

        return {
            patient_id: patient.patient_id,
            checkin_duration: parseFloat(checkinDur.toFixed(1)),
            wait_duration: parseFloat(waitDur.toFixed(1)),
            encounter_duration: parseFloat(encounterDur.toFixed(1)),
            documentation_duration: parseFloat(docDur.toFixed(1)),
            total_lead_time: parseFloat(totalLeadTime.toFixed(1)),
            value_added_time: parseFloat(encounterDur.toFixed(1)),
            simulation_type: isOptimized ? 'Optimized' : 'Current State'
        };
    });

    return results;
}

module.exports = { simulateWorkflow };
