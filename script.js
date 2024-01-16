function generateCalendar() {
    const startDate = new Date(document.getElementById("start-date").value);

    // Adjust the start date to Monday of week 0 (a week before week 1)
    startDate.setDate(startDate.getDate() - (startDate.getDay() + 13) % 7);

    // Generate iCal content
    const iCalContent = generateICalContent(startDate);

    // Create a Blob with the iCal content
    const blob = new Blob([iCalContent], { type: "text/calendar;charset=utf-8" });

    // Create a filename based on your specified rules
    const filename = generateFilename();

    // Create a download link
    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = filename;

    // Append the link to the document
    document.body.appendChild(downloadLink);

    // Trigger a click event to start the download
    downloadLink.click();

    // Remove the link from the document
    document.body.removeChild(downloadLink);
}

function generateICalContent(startDate) {
    let calendarData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Organization//Academic Calendar Generator//EN`;

    // Generate weeks 0 to 6
    for (let currentWeek = 0; currentWeek <= 6; currentWeek++) 
    {
        calendarData += generateICalEntry(startDate, "Week "+currentWeek);
        startDate.setDate(startDate.getDate() + 7); // Move to the next week
    }

    // Insert recess week
    calendarData += generateICalEntry(startDate, "Recess Week");
    startDate.setDate(startDate.getDate() + 7); // Move to the next week

    // Generate weeks 7 to 13
    for (let currentWeek = 7; currentWeek <= 13; currentWeek++) {
        calendarData += generateICalEntry(startDate, "Week "+currentWeek);
        startDate.setDate(startDate.getDate() + 7); // Move to the next week
    }

    // Insert reading week
    calendarData += generateICalEntry(startDate, "Reading Week");
    startDate.setDate(startDate.getDate() + 7); // Move to the next week

    // Insert exam weeks
    calendarData += generateICalEntry(startDate, "Exam Week 1");
    startDate.setDate(startDate.getDate() + 7); // Move to the next week
    calendarData += generateICalEntry(startDate, "Exam Week 2");

    // End of calendar
    calendarData += "\nEND:VCALENDAR";

    return calendarData;
}

function generateICalEntry(startDate, week) {
    const formattedStartDate = startDate.toISOString().replace(/[-:]/g, "").split("T")[0] + "T160000000Z";
    const formattedEndDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, "")
        .split("T")[0] + "T160000000Z";

    return `
BEGIN:VEVENT
SUMMARY:${week}
DTSTART:${formattedStartDate}
DTEND:${formattedEndDate}
DESCRIPTION:
LOCATION:
SEQUENCE:0
STATUS:CONFIRMED
TRANSP:TRANSPARENT
BEGIN:VALARM
TRIGGER;VALUE=DATE-TIME:${formattedStartDate}
DESCRIPTION:
ACTION:DISPLAY
END:VALARM
END:VEVENT
`;
}

function generateFilename() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // Month is zero-based

    // Naming rules based on the current date
    if (currentMonth >= 3 && currentMonth <= 11) {
        // Between April and December
        return `AY${currentYear.toString().slice(-2)}_${(currentYear + 1).toString().slice(-2)}_S1.ics`;
    } else {
        // Between November and March
        const academicYear = currentMonth >= 0 && currentMonth <= 4 ? (currentYear - 1).toString().slice(-2) : currentYear.toString().slice(-2);
        return `AcadWeeks_ AY${academicYear}_${currentYear.toString().slice(-2)}_S2.ics`;
    }
}
