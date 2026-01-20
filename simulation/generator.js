const { faker } = require('@faker-js/faker');

function generatePatientData(numPatients = 50) {
    const patients = [];

    // Base start time for the day (8:00 AM)
    const baseTime = new Date();
    baseTime.setHours(8, 0, 0, 0);

    for (let i = 0; i < numPatients; i++) {
        // Stagger arrival times
        const arrivalBias = i * (Math.floor(Math.random() * (15 - 5 + 1)) + 5); // 5 to 15 minutes
        const arrivalTime = new Date(baseTime.getTime() + arrivalBias * 60000);

        const appointmentScheduled = new Date(arrivalTime.getTime() - (Math.floor(Math.random() * 14) + 1) * 24 * 60 * 60 * 1000);

        const conditions = ['Routine Checkup', 'Flu Symptoms', 'Hypertension', 'Diabetes Follow-up', 'Acute Pain'];

        const patient = {
            patient_id: faker.string.uuid().substring(0, 8),
            name: faker.person.fullName(),
            age: Math.floor(Math.random() * (90 - 18 + 1)) + 18,
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            arrival_time: arrivalTime,
            appointment_scheduled: appointmentScheduled
        };
        patients.push(patient);
    }

    return patients;
}

module.exports = { generatePatientData };
