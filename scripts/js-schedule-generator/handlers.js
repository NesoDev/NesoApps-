export function nullEntriesExist(courses) {
    for (const course of courses) {
        for (const section of course.secciones) {
            if (
                section.teoria.dia === '' ||
                section.teoria.inicio === '00:00' ||
                section.teoria.fin === '00:00' ||
                section.practica.dia === '' ||
                section.practica.inicio === '00:00' ||
                section.practica.fin === '00:00'
            ) {
                return true;
            }
        }
    }
    return false;
}

export function invalidEntriesExist(courses) {
    for (const course of courses) {
        for (const section of course.secciones) {
            if (section.teoria.dia == section.practica.dia) {
                const lapse1InitStr = section.teoria.inicio;
                const lapse1EndStr = section.teoria.fin;
                const lapse2InitStr = section.practica.inicio;
                const lapse2EndStr = section.practica.fin;

                console.log(`teoria: ${lapse1InitStr} - ${lapse1EndStr}`);
                console.log(`practica: ${lapse2InitStr} - ${lapse2EndStr}`);


                function parseHour(hourStr) {
                    const [hour, minute] = hourStr.split(':');
                    const date = new Date();
                    date.setHours(Number(hour), Number(minute), 0, 0);
                    return date;
                }

                const lapse1Init = parseHour(lapse1InitStr);
                const lapse1End = parseHour(lapse1EndStr);
                const lapse2Init = parseHour(lapse2InitStr);
                const lapse2End = parseHour(lapse2EndStr);

                if ((lapse2Init < lapse1End && lapse1End <= lapse2End) || (lapse2Init <= lapse1Init && lapse1Init < lapse2End)) {
                    return true;
                }
                
            }
        }
    }
    return false;
}
