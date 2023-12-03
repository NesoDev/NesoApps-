import createSchedules from "./schedule_actions.js";
const { ColorThief, chroma } = window;

// Resto de tu código
export async function sendCoursesToTheServer(courses) {
    try {
        const response = await fetch("/schedule-generator/api/data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(courses),
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const processedData = await response.json();
        console.log("-- RECIBIENDO DATOS DEL BACKEND --");
        console.log(processedData);

        return createSchedules(processedData);
    } catch (error) {
        console.error("ERROR AL REALIZAR LA SOLICITUD AL BACKEND: ", error);
        throw error;
    }
}

export async function sendArchiveToTheServer(file) {
    const formData = new FormData();
    formData.append("pdf", file, file.name);

    try {
        const response = await fetch("/schedule-generator/api/file-upload", {
            method: "POST",
            body: formData
        });
        const coursesObject = await response.json();
        console.log("-- RECIBIENDO DATOS DEL BACKEND --");
        console.log(coursesObject);
        return coursesObject;
    } catch (error) {
        console.error("ERROR AL REALIZAR LA SOLICITUD AL BACKEND: ", error);
        throw error;
    }
}

const pastelColors = [
    '#C1FF72',
    '#9FEFC6',
    '#82B7F6',
    '#F1FF4D',
    '#5BFF66',
    '#9FE9FD',
    '#B7BCEF',
    '#FF8686',
    '#c5e0dc',
    '#e0ffff'
];

export function generatePastelPaletteFromImage(courses) {
    const pastelPalette = [];
    const n = courses.length;

    for (let i = 0; i < n; i++) {
        const pastelColor = pastelColors[i % pastelColors.length];
        pastelPalette.push(pastelColor);
    }

    console.log(pastelPalette);

    courses.forEach((course, i) => {
        let color = pastelPalette[i];
        course.color = color;
    });

    return courses;
}
