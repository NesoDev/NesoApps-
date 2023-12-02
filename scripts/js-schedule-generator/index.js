import { uploadFilePDF, addCourse, addSection, removeCourse, removeSection, updateCoursesObject, sendCoursesButtonPressed } from "./events_actions.js";
import { renderCourses } from "./user_interface.js";
import { sendArchiveToTheServer } from "./api.js";


let body = document.querySelector("body");
let tableBody = document.querySelector("tbody");
let courses = [];

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

document.addEventListener("DOMContentLoaded", function () {
    renderCourses(courses, tableBody);
    let inputNameCourse = document.getElementById("input-name-course");
    let buttonRegisterNameCourse = document.getElementById("button-register-name-course");
    let buttonUploadPdf = document.getElementById("button-load-pre-registration-form");
    let buttonGenerateSchedule = document.getElementById("button-generate-schedule");
    let table = document.querySelector("table");

    buttonRegisterNameCourse.addEventListener("click", function () {
        console.log("-- CURSO REGISTRADO --");
        let nameCourse = inputNameCourse.value;
        if (nameCourse.trim() != "") {
            addCourse(courses, nameCourse, tableBody);
            inputNameCourse.value = "";
        } else {
            alert(`¡ INGRESE EL NOMBRE DE UN CURSO VÁLIDO !`);
        }
    })

    buttonUploadPdf.addEventListener("click", function () {
        console.log("-- ABRIENDO EXPLORADOR DE ARCHIVOS --");

        uploadFilePDF()
            .then(selectedFile => {
                console.log("-- ENVIANDO ARCHIVO AL BACKEND --");
                return sendArchiveToTheServer(selectedFile);
            })
            .then(coursesFile => {
                console.log("-- DATOS RECIBIDOS DEL BACKEND --");
                console.log(courses);
                courses = coursesFile
                renderCourses(courses, tableBody);
            })
            .catch(error => {
                console.error("ERROR:", error);
            });
    });

    inputNameCourse.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            console.log("-- CURSO REGISTRADO --");
            let nameCourse = inputNameCourse.value;
            if (nameCourse.trim() != "") {
                addCourse(courses, nameCourse, tableBody);
                inputNameCourse.value = "";
            } else {
                alert(`¡ INGRESE EL NOMBRE DE UN CURSO VÁLIDO !`);
            }
        }
    });

    buttonGenerateSchedule.addEventListener("click", async function () {
        sendCoursesButtonPressed(courses, body);
    })

    table.addEventListener("click", function (event) {
        updateCoursesObject(courses);
        if (event.target.classList.contains("remove-section-img")) {
            let idButtonRemove = event.target.id;
            let idSection = parseInt(idButtonRemove.split("-")[4]);
            let idCourse = parseInt(idButtonRemove.split("-")[3]);

            removeSection(courses, idCourse, idSection, tableBody);
        }

        if (event.target.classList.contains("add-section-img")) {
            let idButtonAdd = event.target.id;
            let idCourse = parseInt(idButtonAdd.split("-")[3]);

            addSection(courses, idCourse, tableBody);
        }

        if (event.target.classList.contains("remove-course-img")) {
            let idButtonRemove = event.target.id;
            let idCourse = parseInt(idButtonRemove.split("-")[3]);

            removeCourse(courses, idCourse, tableBody);
        }
    });
})