import { renderCourses } from "./user_interface.js";
import { sendCoursesToTheServer, generatePastelPaletteFromImage } from "./api.js";
import { createCanvas, createIndicatorOfActualSchedule } from "./schedule_actions.js";
import { nullEntriesExist, invalidEntriesExist } from "./handlers.js";
const { jsPDF } = window.jspdf;

export function uploadFilePDF() {
    return new Promise((resolve, reject) => {
        let inputPDF = document.createElement("input");
        inputPDF.type = "file";
        inputPDF.accept = ".pdf";
        inputPDF.click();
        inputPDF.addEventListener("change", function () {
            let selectedFile = inputPDF.files[0];
            console.log("ARCHIVO SELECCIONADO: ", selectedFile.name);
            resolve(selectedFile);
        });
    });
}

export function addCourse(courses, nameCourse, tableBody) {
    console.log(`-- AGREGANDO CURSO --`);
    let idCourse = courses.findIndex(course => course.nombre === nameCourse);
    if (idCourse == -1) {
        console.log(`El curso ${nameCourse} aun no estaba registrado`)
        let newCourse = {
            nombre: nameCourse,
            secciones: [
            ]
        };
        courses.push(newCourse);
        idCourse = courses.findIndex(course => course.nombre === nameCourse);
        addSection(courses, idCourse, tableBody);
    } else if (courses.length !== 0) {
        console.log(`El curso ${nameCourse} ya estaba registrado`);
        addSection(courses, idCourse, tableBody);
    }
}

export function removeCourse(courses, idCourse, tableBody) {
    console.log(`-- ELIMINANDO CURSO --`);
    if (idCourse >= 0 && idCourse < courses.length) {
        courses.splice(idCourse, 1);
        renderCourses(courses, tableBody);
    }
}

export function addSection(courses, idCourse, tableBody) {
    console.log(`-- AGREGANDO NUEVA SECCION --`);
    let course = courses[idCourse];
    let idSection = course.secciones.length;

    let newSection = {
        id: idSection,
        teoria: {
            dia: "",
            inicio: "00:00",
            fin: "00:00",
        },
        practica: {
            dia: "",
            inicio: "00:00",
            fin: "00:00",
        },
        preferencia: 0
    };
    course.secciones.push(newSection);
    renderCourses(courses, tableBody);
}

export function removeSection(courses, idCourse, numberSection, tableBody) {
    console.log(`-- ELIMINANDO SECCION ${numberSection} del curso ${idCourse} ---`);
    let course = courses[idCourse];
    if (numberSection >= 0 && numberSection < course.secciones.length) {
        course.secciones.splice(numberSection, 1);
        renderCourses(courses, tableBody);
    }
}

export function updateCoursesObject(courses) {
    courses.forEach((course, idCourse) => {
        console.log(`--- ACTUALIZANDO DICCIONARIO ---`);
        console.log(`-- ACTUALIZANDO CURSO ${idCourse} --`);
        course.secciones.forEach((section, sectionNumber) => {
            console.log(`-- ACTUALIZANDO SECCION ${sectionNumber} --`);

            let daySelectTheory = document.getElementById(`day-select-theory-${idCourse}-${sectionNumber}`);
            let timeInputStartTheory = document.getElementById(`time-input-start-theory-${idCourse}-${sectionNumber}`);
            let timeInputEndTheory = document.getElementById(`time-input-end-theory-${idCourse}-${sectionNumber}`);

            let daySelectPractice = document.getElementById(`day-select-practice-${idCourse}-${sectionNumber}`);
            let timeInputStartPractice = document.getElementById(`time-input-start-practice-${idCourse}-${sectionNumber}`);
            let timeInputEndPractice = document.getElementById(`time-input-end-practice-${idCourse}-${sectionNumber}`);

            let preferenceInput = document.getElementById(`preference-input-${idCourse}-${sectionNumber}`);

            section.teoria.dia = daySelectTheory.value;
            section.teoria.inicio = timeInputStartTheory.value;
            section.teoria.fin = timeInputEndTheory.value;
            console.log(`- Teoría: ${daySelectTheory.value} de ${timeInputStartTheory.value} a ${timeInputEndTheory.value}`);
            section.practica.dia = daySelectPractice.value;
            section.practica.inicio = timeInputStartPractice.value;
            section.practica.fin = timeInputEndPractice.value;
            console.log(`- Práctica: ${daySelectPractice.value} de ${timeInputStartPractice.value} a ${timeInputEndPractice.value}`);
            section.preferencia = preferenceInput.value;
        });
    });
    console.log(`-- ACTUALIZANDO DICCIONARIO CURSOS --`);
    console.log(courses);
}

export async function showOverLaySection(overlappedElement) {
    if (window.scrollY !== 0) {
        await returnToTop();
    }
    console.log("-- YA ESTAMOS EN LA PARTE SUPERIOR --");

    console.log("  EMPEZAMOS A CREAR LA CAPA SOLAPANTE  ");
    // Creamos la capa solapante
    let overlaySection = document.createElement("section");
    overlaySection.classList.add('overlay-section');
    overlaySection.id = 'overlay-section';

    document.querySelector("header").classList.add("header-over-lay");

    let headerOfOverLay = document.createElement("div");
    headerOfOverLay.classList.add('header-of-overlay');

    let divIconLeft = document.createElement("div");
    let imgIconBack = document.createElement("img");
    divIconLeft.classList.add("div-icon-left");
    let containerImgIconBack = document.createElement("div");
    containerImgIconBack.classList.add("container-img-icon-back");
    imgIconBack.classList.add("icon-of-header-over-lay");
    imgIconBack.src = "https://res.cloudinary.com/dimcnbuqs/image/upload/v1699839878/back_icon_vak79d.png";

    containerImgIconBack.appendChild(imgIconBack)

    divIconLeft.appendChild(containerImgIconBack);

    let divIconRight = document.createElement("div");
    let imgIconDownload = document.createElement("img");
    divIconRight.classList.add("div-icon-right");
    let containerImgIconDownload = document.createElement("div");
    containerImgIconDownload.classList.add("container-img-icon-download");
    imgIconDownload.classList.add("icon-of-header-over-lay");
    imgIconDownload.src = "https://res.cloudinary.com/dimcnbuqs/image/upload/v1699840238/download-icon_iszxzg.png";

    containerImgIconDownload.appendChild(imgIconDownload);

    let imgIconAnime = document.createElement("img");
    imgIconAnime.classList.add("icon-anime-of-header-over-lay");
    imgIconAnime.src = "https://res.cloudinary.com/dimcnbuqs/image/upload/v1699839849/anime_girl_nyvdoe.gif";

    divIconRight.appendChild(containerImgIconDownload);
    divIconRight.appendChild(imgIconAnime);

    headerOfOverLay.appendChild(divIconLeft);
    headerOfOverLay.appendChild(divIconRight);

    overlaySection.appendChild(headerOfOverLay);

    overlappedElement.classList.add('no-scroll');

    document.querySelector(".logo-nesoApp").classList.add("logo-nesoApp-over-lay");
    document.querySelector(".name-app").classList.add("name-app-over-lay");

    overlappedElement.appendChild(overlaySection);

    return document.querySelector(".overlay-section");
}

export function closeOverLaySection(overlappedElement, overlappingElement) {
    overlappingElement.remove();
    overlappedElement.classList.remove("no-scroll");
    document.querySelector("header").classList.remove("header-over-lay");
    document.querySelector(".logo-nesoApp").classList.remove("logo-nesoApp-over-lay");
    document.querySelector(".name-app").classList.remove("name-app-over-lay");
}

function returnToTop() {
    return new Promise(resolve => {
        let targetElement = document.querySelector("body");

        const targetOffset = targetElement.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
            top: targetOffset,
            behavior: 'smooth'
        });

        window.addEventListener('scroll', function handler() {
            if (window.scrollY === targetOffset) {
                window.removeEventListener('scroll', handler);
                resolve();
            }
        });
    });
}

export async function sendCoursesButtonPressed(courses, body) {
    try {
        console.log("-- BUTTON SEND COURSES PRESIONADO --");
        console.log(`Cursos: ${courses}`)
        updateCoursesObject(courses);

        if (!courses || courses.length === 0) {
            alert(`¡ NO EXISTEN CURSOS REGISTRADOS !`);
        } else if (nullEntriesExist(courses)) {
            alert(`ERROR: EXISTEN ENTRADAS SIN COMPLETAR`)
        } else if (invalidEntriesExist(courses)) {
            alert(`ERROR: LAS HORAS DE PRÁCTICA Y LABORATORIO NO DEBEN CRUZARSE`)
        } else {

            courses = generatePastelPaletteFromImage(courses);

            console.log(`-- ENVIANDO DATOS AL BACKEND --`);

            const overlaySection = await showOverLaySection(body);

            console.log("overLaySection terminó de crearse");

            overlaySection.classList.add('show');

            //Mostramos imagen de espera mientras cargan los horarios
            let containerImgMessageLoadSchedule = document.createElement('div');
            containerImgMessageLoadSchedule.classList.add('container-img-message-load-schedule');

            let imgLoadSchedule = document.createElement('img');
            imgLoadSchedule.classList.add('img-load-schedule');
            imgLoadSchedule.src = "https://res.cloudinary.com/dimcnbuqs/image/upload/v1701572158/chika_wb6rpr.gif";
            containerImgMessageLoadSchedule.appendChild(imgLoadSchedule);

            let messageLoadSchedule = document.createElement('div');
            messageLoadSchedule.classList.add('message-load-schedule');
            messageLoadSchedule.innerHTML = "<p>Estamos generando tus horarios ⚙️</p><p>Espere un momento...</p>";
            containerImgMessageLoadSchedule.appendChild(messageLoadSchedule);

            overlaySection.appendChild(containerImgMessageLoadSchedule);

            let headerOfOverLaySection = document.querySelector(".header-of-overlay");
            headerOfOverLaySection.addEventListener("mouseover", () => {
                headerOfOverLaySection.style.opacity = 1;
            });

            setTimeout(() => {
                headerOfOverLaySection.style.opacity = 0;
            }, 3000);

            headerOfOverLaySection.addEventListener("mouseleave", () => {
                setTimeout(() => {
                    headerOfOverLaySection.style.opacity = 0;
                }, 3000);
            });

            let buttonBackOfHeaderOfOverLaySection = document.querySelector(".container-img-icon-back");

            buttonBackOfHeaderOfOverLaySection.addEventListener("click", function () {
                console.log("Botón hacia atrás presionado");
                closeOverLaySection(body, overlaySection);
            });

            let buttondownloadOfHeaderOfOverLaySection = document.querySelector(".container-img-icon-download");

            buttondownloadOfHeaderOfOverLaySection.addEventListener("click", () => {
                let scheduleToDownload = document.querySelector(".container-table-schedule");

                const rect = scheduleToDownload.getBoundingClientRect();
                const realWidth = rect.width;
                const realHeight = rect.height;

                var PDF_Width = realWidth;
                var PDF_Height = realHeight;

                var canvas_image_width = PDF_Width;
                var canvas_image_height = PDF_Height;

                var scaleFactor = 4; // Resolucion de imagen

                html2canvas(scheduleToDownload, { scale: scaleFactor }).then(function (canvas) {
                    var imgData = canvas.toDataURL("image/png");

                    var pdf = new jsPDF('landscape', 'pt', [PDF_Width, PDF_Height]);
                    pdf.addImage(imgData, 'PNG', 0, 0, canvas_image_width, canvas_image_height, '', 'FAST'); // Ajusta la calidad

                    pdf.save("nesoHorario.pdf");
                });
            });

            overlaySection.addEventListener("click", function (event) {
                if (event.target === overlaySection) {
                    closeOverLaySection(body, overlaySection);
                }
            });

            const schedulesHTML = await sendCoursesToTheServer(courses);

            console.log(`Schedules HTML: ${schedulesHTML}`);

            // Eliminamos la imagen de espera
            containerImgMessageLoadSchedule.remove();

            createIndicatorOfActualSchedule(overlaySection);

            let indexActualSchedule = 0;
            createCanvas(schedulesHTML, indexActualSchedule, overlaySection);

            let textQuantityOfSchedules = document.querySelector(".text-quantity-of-schedules");
            textQuantityOfSchedules.textContent = schedulesHTML.length;

            let buttonBeforeSlide = document.querySelector(".button-before-schedule");
            let buttonAfterSlide = document.querySelector(".button-after-schedule");

            buttonBeforeSlide.addEventListener('click', () => {
                console.log("Botón hacia atrás presionado");
                indexActualSchedule = previousSchedule(indexActualSchedule, schedulesHTML, overlaySection);
            });

            buttonAfterSlide.addEventListener('click', () => {
                console.log("Botón hacia adelante presionado");
                indexActualSchedule = nextSchedule(indexActualSchedule, schedulesHTML, overlaySection);
            });

        }
    } catch (error) {
        console.error('Error en el manejo de la promesa:', error);
    }
}

function nextSchedule(indexActualSchedule, schedulesHTML, overlaySection) {
    if (indexActualSchedule < schedulesHTML.length - 1) {
        indexActualSchedule += 1;
        console.log(`Horario Actual : ${indexActualSchedule}`);
        let canvas = document.querySelector(".canvas");
        let displayedSchedule = document.querySelector(".container-table-schedule");
        canvas.replaceChild(schedulesHTML[indexActualSchedule], displayedSchedule)

        let actualSchedule = document.querySelector(".indicator-actual-page");
        actualSchedule.textContent = indexActualSchedule + 1;
    }
    return indexActualSchedule;
}

function previousSchedule(indexActualSchedule, schedulesHTML, overlaySection) {
    if (indexActualSchedule > 0) {
        indexActualSchedule -= 1;
        console.log(`Horario Actual : ${indexActualSchedule}`);
        let canvas = document.querySelector(".canvas");
        let displayedSchedule = document.querySelector(".container-table-schedule");
        canvas.replaceChild(schedulesHTML[indexActualSchedule], displayedSchedule);

        let actualSchedule = document.querySelector(".indicator-actual-page");
        actualSchedule.textContent = indexActualSchedule + 1;
    }
    return indexActualSchedule;
}

export function showGuide(overlappedElement) {
    console.log("-- CREANDO SHOW GUIDE --");

    console.log("  EMPEZAMOS A CREAR LA CAPA SOLAPANTE  ");
    // Creamos la capa solapante
    let overlaySection = document.createElement("section");
    overlaySection.classList.add('overlay-section');
    overlaySection.id = 'overlay-section';

    let slidesGuide = [
        "https://res.cloudinary.com/dimcnbuqs/image/upload/v1701354899/1_ueuixs.png",
        "https://res.cloudinary.com/dimcnbuqs/image/upload/v1701354760/2_uh2myi.png",
        "https://res.cloudinary.com/dimcnbuqs/image/upload/v1701311959/3_eabe1d.png",
        "https://res.cloudinary.com/dimcnbuqs/image/upload/v1701311943/4_zhifeh.png",
        "https://res.cloudinary.com/dimcnbuqs/image/upload/v1701311959/5_q1h1j1.png"
    ]

    // Creamos el carrousel
    let carruselGuide = document.createElement("div");
    carruselGuide.classList.add('carrusel-guide');

    // Creamos el contenedor de los slides
    let containerSlides = document.createElement('div');
    containerSlides.classList.add('container-slides');

    slidesGuide.forEach((slideUrl, i) => {
        // Creo un img
        let imgSlide = document.createElement('img');
        imgSlide.src = slideUrl;
        imgSlide.alt = `Image ${i}`;
        containerSlides.appendChild(imgSlide);
    })

    //Creamos el boton cerrar
    //let buttonExitSlidesGuide = document.createElement('img');
    //buttonExitSlidesGuide.classList.add("button-exit-slides-guide");
    //buttonExitSlidesGuide.src = "https://res.cloudinary.com/dimcnbuqs/image/upload/v1701415815/Dise%C3%B1o_sin_t%C3%ADtulo_22_omnbxw.png";

    let buttonExitSlidesGuide = document.createElement('input');
    buttonExitSlidesGuide.classList.add("button-exit-slides-guide");
    buttonExitSlidesGuide.type = "submit";
    buttonExitSlidesGuide.value = "OMITIR"
    buttonExitSlidesGuide.id = "button-exit-slides-guide";
    buttonExitSlidesGuide.name = "button-exit-slides-guide";

    //Creamos los botones de control
    let buttonBeforeSlide = document.createElement("img");
    buttonBeforeSlide.classList.add("button-scrooll-slides");
    buttonBeforeSlide.classList.add("button-before-slide");
    buttonBeforeSlide.src = "https://res.cloudinary.com/dimcnbuqs/image/upload/v1699952412/11_rixjho.png";

    let buttonAfterSlide = document.createElement("img");
    buttonAfterSlide.classList.add("button-scrooll-slides");
    buttonAfterSlide.classList.add("button-after-slide");
    buttonAfterSlide.src = "https://res.cloudinary.com/dimcnbuqs/image/upload/v1699952412/10_b1uefl.png";

    overlaySection.appendChild(buttonExitSlidesGuide);

    carruselGuide.appendChild(containerSlides);

    overlaySection.appendChild(buttonBeforeSlide);

    overlaySection.appendChild(carruselGuide);

    overlaySection.appendChild(buttonAfterSlide);

    overlappedElement.appendChild(overlaySection);

    return document.querySelector(".overlay-section");
}
