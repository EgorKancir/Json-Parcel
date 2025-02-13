const studentsArr = []; 
const saveButton = document.querySelector('.students-form__button--save');
const addButton = document.querySelector('.students-form__button--add');
const studentForm = document.getElementById('students-form');
const studentsGroup = document.getElementById("students-table__body");
const downloadBtn = document.querySelector(".students-table__download-btn");
const table = document.querySelector(".students-table");

function formCleaner() {
    document.getElementById('first-name').value = "";
    document.getElementById('last-name').value = "";
    document.getElementById('age').value = "";
    document.getElementById('course').value = "";
    document.getElementById('faculty').value = "";
    document.getElementById('student-courses').value = "";
}

function noteForUser() {
    if (studentsArr.length > 0) {
        table.classList.add("disable");
    } else if (studentsArr.length === 0) {
        table.classList.remove("disable");
    }
}

function updateNumbers() {
    document.querySelectorAll("#students-table__body .students-table__body-tr").forEach((row, index) => {
        row.querySelector(".students-table__body-td--number").textContent = index + 1;
    });
}

studentForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const studentData = {
        number: studentsArr.length + 1,
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        age: document.getElementById('age').value,
        course: document.getElementById('course').value,
        faculty: document.getElementById('faculty').value,
        studentCourses: document.getElementById('student-courses').value
    };

    studentsArr.push(studentData);
    renderTable();
    event.target.reset();
    updateNumbers();  
    noteForUser();  
});

function renderTable() {
    const source = document.getElementById('students-table__body-template').innerHTML.trim();
    const template = Handlebars.compile(source);

    studentsGroup.innerHTML = studentsArr.map(student => template(student)).join('');
}

function editElement(id) {
    let elementId = Number(id);
    const student = studentsArr.find(s => s.number === elementId);
    
    if (!student) {
        console.error(`Студент з ID ${id} не знайдений`);
        return;
    }

    document.getElementById('first-name').value = student.firstName;
    document.getElementById('last-name').value = student.lastName;
    document.getElementById('age').value = student.age;
    document.getElementById('course').value = student.course;
    document.getElementById('faculty').value = student.faculty;
    document.getElementById('student-courses').value = student.studentCourses;
    
    saveButton.onclick = function() {
        const index = studentsArr.findIndex(s => s.number === elementId);
        
        if (index !== -1) {
            studentsArr[index] = {
                number: elementId,
                firstName: document.getElementById('first-name').value,
                lastName: document.getElementById('last-name').value,
                age: document.getElementById('age').value,
                course: document.getElementById('course').value,
                faculty: document.getElementById('faculty').value,
                studentCourses: document.getElementById('student-courses').value
            };
            renderTable();
        }
        saveButton.classList.remove('active');
        addButton.classList.remove('disable');
        studentForm.classList.remove('active');
        formCleaner();
        updateNumbers();
        noteForUser();
    };
}

function deleteElement(id) {
    let elementId = Number(id);
    const index = studentsArr.findIndex(s => s.number === elementId);

    if (index !== -1) {
        studentsArr.splice(index, 1);
        console.log(`Студент з ID ${elementId} видалений`);
        renderTable();
    }
    updateNumbers();
    noteForUser();
}

document.getElementById("students-table__body").addEventListener('click', (event) => {
    const editButton = event.target.closest('.students-table__body-btn--edit');
    const deleteBtn = event.target.closest('.students-table__body-btn--delete');

    if (editButton) {
        editElement(editButton.id);
        saveButton.classList.add('active');
        addButton.classList.add('disable');
        studentForm.classList.add('active');
    } else if (deleteBtn) {
        deleteElement(deleteBtn.id);
    }
});

// JSON

function downloadJSON(filename, jsonData) {
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a); 

    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); 
}

downloadBtn.addEventListener("click", () => {
    if (studentsArr.length > 0) {
        const jsonStudents = JSON.stringify(studentsArr, null, 2);
        downloadJSON("Students.json", jsonStudents);
        try {
            const parseDataStudents = JSON.parse(jsonStudents);
            console.log("JSON students is valid:", Array.isArray(parseDataStudents));
        } catch (error) {
            console.error("Invalid JSON:", error);
        }
    } else {
        alert("You don't have students yet!");
    }
});
