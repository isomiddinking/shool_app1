let currentTeacher; // Declare globally accessible for other functions

document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Control Logic (Robust Implementation) ---
    const textColorPicker = document.getElementById('textColorPicker');
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Function to apply theme settings
    function applyTheme() {
        const savedTextColor = localStorage.getItem('siteTextColor');
        if (savedTextColor) {
            document.body.style.setProperty('color', savedTextColor, 'important');
            if (textColorPicker) textColorPicker.value = savedTextColor;
        } else {
            if (textColorPicker) textColorPicker.value = '#333333';
            document.body.style.setProperty('color', '#333333', 'important');
        }

        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'enabled') {
            document.body.classList.add('dark-mode');
            if (darkModeToggle) {
                darkModeToggle.querySelector('.button-text').textContent = 'Light Mode';
                darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
            }
        } else {
            document.body.classList.remove('dark-mode');
            if (darkModeToggle) {
                darkModeToggle.querySelector('.button-text').textContent = 'Dark Mode';
                darkModeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
            }
        }
    }

    applyTheme();

    // Event listener for color picker
    if (textColorPicker) {
        textColorPicker.addEventListener('input', (event) => {
            const selectedColor = event.target.value;
            document.body.style.setProperty('color', selectedColor, 'important');
            localStorage.setItem('siteTextColor', selectedColor);
        });
    }

    // Event listener for dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');

            if (isDarkMode) {
                darkModeToggle.querySelector('.button-text').textContent = 'Light Mode';
                darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
            } else {
                darkModeToggle.querySelector('.button-text').textContent = 'Dark Mode';
                darkModeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
            }
        });
    }
    // --- End Theme Control Logic ---


    // --- Existing Teacher Panel Logic ---
    const currentTeacherLogin = localStorage.getItem('currentTeacherLogin');
    if (!currentTeacherLogin || localStorage.getItem('loggedInUserRole') !== 'teacher') {
        window.location.href = 'index.html'; // Redirect if not logged in as teacher
        return;
    }

    let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    currentTeacher = teachers.find(t => t.login === currentTeacherLogin); // Assign to global variable

    if (currentTeacher) {
        document.getElementById('teacherNameSidebar').textContent = currentTeacher.name;
        document.getElementById('headerTeacherName').textContent = currentTeacher.name;

        // Placeholder for profile picture
        const teacherProfilePicUrl = localStorage.getItem(`teacherProfilePicUrl_${currentTeacher.login}`) || "https://via.placeholder.com/80/007bff/ffffff?text=TCH";
        document.getElementById('teacherProfilePic').src = teacherProfilePicUrl;
        document.getElementById('headerTeacherProfilePic').src = teacherProfilePicUrl;
        document.getElementById('teacherProfilePreview').src = teacherProfilePicUrl;


        // Initial section display
        window.showTeacherSection('main-dashboard', document.querySelector('.sidebar nav ul li a.active'));
        window.loadSubjectsForTeacher(); // Load subjects for this teacher

        // Profile settings initialization
        document.getElementById('teacherLoginEdit').value = currentTeacher.login;
        document.getElementById('teacherPasswordEdit').value = currentTeacher.password;

        // Handle profile picture input change
        document.getElementById('teacherProfilePicInput').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('teacherProfilePreview').src = e.target.result;
                    localStorage.setItem(`teacherProfilePicUrl_${currentTeacher.login}`, e.target.result);
                    document.getElementById('teacherProfilePic').src = e.target.result;
                    document.getElementById('headerTeacherProfilePic').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

    } else {
        alert('O‘qituvchi ma’lumotlari topilmadi!');
        window.location.href = 'index.html';
    }


}); // End of DOMContentLoaded

// Global functions for teacher.html
window.showTeacherSection = function(sectionId, clickedLink) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    if (clickedLink) {
        clickedLink.classList.add('active');
    }
};

window.loadSubjectsForTeacher = function() {
    const subjectSelect = document.getElementById('subjectSelect');
    subjectSelect.innerHTML = '<option value="">Fanni tanlang</option>'; // Clear existing options
    const assignments = JSON.parse(localStorage.getItem('subjectTeacherAssignments')) || {};
    const subjects = [ // Define your subjects here (must match admin.js)
        { name: "Matematika", id: "math" },
        { name: "Fizika", id: "physics" },
        { name: "Kimyo", id: "chemistry" },
        { name: "Biologiya", id: "biology" },
        { name: "Tarix", id: "history" },
        { name: "Adabiyot", id: "literature" },
        { name: "Ona tili", id: "motherTongue" },
        { name: "Ingliz tili", id: "english" },
        { name: "Jismoniy tarbiya", id: "pe" },
        { name: "Chizmachilik", id: "drawing" }
    ];

    let hasSubjects = false;
    for (const subjectId in assignments) {
        // Check if the current logged-in teacher is assigned to this subject
        if (currentTeacher && assignments[subjectId] === currentTeacher.login) {
            const subject = subjects.find(s => s.id === subjectId);
            if (subject) {
                const option = document.createElement('option');
                option.value = subject.name; // Use subject name as value
                option.textContent = subject.name;
                subjectSelect.appendChild(option);
                hasSubjects = true;
            }
        }
    }

    if (!hasSubjects) {
         subjectSelect.innerHTML = '<option value="">Sizga biriktirilgan fanlar mavjud emas.</option>';
         // Clear student table if no subjects
         document.getElementById('studentTable').querySelector('tbody').innerHTML = '<tr><td colspan="4">Fanni tanlang.</td></tr>';
    }

    // Add event listener to subject select if not already present
    // Ensure this listener is only added once
    if (!subjectSelect.hasAttribute('data-listener-added')) {
        subjectSelect.addEventListener('change', function() {
            const selectedSubject = this.value;
            if (selectedSubject) {
                window.loadStudentsForSubject(selectedSubject);
            } else {
                document.getElementById('studentTable').querySelector('tbody').innerHTML = '<tr><td colspan="4">Fanni tanlang.</td></tr>';
            }
        });
        subjectSelect.setAttribute('data-listener-added', 'true');
    }

    // If there are subjects, and none is selected, or if the previously selected subject is no longer assigned,
    // load students for the first available subject.
    if (hasSubjects && subjectSelect.selectedIndex === 0 && subjectSelect.options.length > 1) {
        subjectSelect.selectedIndex = 1; // Select the first actual subject
        window.loadStudentsForSubject(subjectSelect.value);
    } else if (subjectSelect.value) { // If a subject is already selected (e.g., on refresh), reload students for it
         window.loadStudentsForSubject(subjectSelect.value);
    }
};

window.loadStudentsForSubject = function(subjectName) {
    const allStudents = JSON.parse(localStorage.getItem('students')) || [];
    // Filter students by the current teacher's assigned class (assuming a teacher teaches only their assigned class)
    const studentsInClass = allStudents.filter(s => currentTeacher && s.className === currentTeacher.className);

    const studentTableBody = document.getElementById('studentTable').querySelector('tbody');
    studentTableBody.innerHTML = '';

    if (studentsInClass.length === 0) {
        studentTableBody.innerHTML = '<tr><td colspan="4">Bu sinfda o‘quvchilar mavjud emas.</td></tr>';
        return;
    }

    studentsInClass.forEach(student => {
        const row = studentTableBody.insertRow();
        row.insertCell().textContent = `${student.name} ${student.surname}`;

        // Davomat (Attendance) - Example: using a checkbox
        const attendanceCell = row.insertCell();
        const attendanceCheckbox = document.createElement('input');
        attendanceCheckbox.type = 'checkbox';
        attendanceCheckbox.id = `attendance-${student.id}-${subjectName.replace(/\s/g, '')}`;
        // Load previous attendance if available (you would need a structure for this in localStorage)
        const today = new Date().toISOString().split('T')[0];
        if (student.attendance && student.attendance[subjectName] && student.attendance[subjectName][today]) {
            attendanceCheckbox.checked = student.attendance[subjectName][today];
        }

        attendanceCell.appendChild(attendanceCheckbox);

        // Baho (Grade) - Example: using a number input
        const gradeCell = row.insertCell();
        const gradeInput = document.createElement('input');
        gradeInput.type = 'number';
        gradeInput.min = '1';
        gradeInput.max = '5';
        // Load previous grade if available (last grade for this subject)
        const lastMark = (student.marks || []).filter(m => m.subject === subjectName).sort((a,b) => new Date(b.date) - new Date(a.date))[0];
        gradeInput.value = lastMark ? lastMark.grade : '';
        gradeInput.id = `grade-${student.id}-${subjectName.replace(/\s/g, '')}`;
        gradeCell.appendChild(gradeInput);

        // Amallar (Actions) - Example: Save button for individual row
        const actionsCell = row.insertCell();
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Saqlash';
        saveButton.onclick = () => window.saveStudentData(student.id, subjectName, attendanceCheckbox.checked, gradeInput.value);
        actionsCell.appendChild(saveButton);
    });
};

window.saveStudentData = function(studentId, subjectName, attendance, grade) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    const studentIndex = students.findIndex(s => s.id === studentId);

    if (studentIndex !== -1) {
        let student = students[studentIndex];
        if (!student.marks) {
            student.marks = [];
        }
        if (!student.attendance) {
            student.attendance = {};
        }

        // Save attendance (simple example: true/false for today)
        const today = new Date().toISOString().split('T')[0];
        if (!student.attendance[subjectName]) {
            student.attendance[subjectName] = {};
        }
        student.attendance[subjectName][today] = attendance;

        // Save grade
        if (grade) {
            // Remove existing mark for today (if any) to avoid duplicates for the same day
            student.marks = student.marks.filter(m => !(m.subject === subjectName && m.date === today));
            student.marks.push({
                subject: subjectName,
                date: today,
                grade: parseInt(grade)
            });
        }

        students[studentIndex] = student;
        localStorage.setItem('students', JSON.stringify(students));
        alert(`${student.name} ${subjectName} fani bo'yicha ma'lumotlari saqlandi!`);
    }
};

window.saveChanges = function() {
    alert('O‘zgarishlar saqlandi! (Har bir o‘quvchi qatorida individual saqlash tugmasi orqali saqlanadi.)');
    // Note: This button is currently a placeholder as individual row save buttons are implemented.
    // If you want a single "Save All" button, this function would need to iterate through all rows.
};

window.updateTeacherProfile = function() {
    const newLogin = document.getElementById('teacherLoginEdit').value.trim();
    const newPassword = document.getElementById('teacherPasswordEdit').value.trim();
    const currentTeacherLogin = localStorage.getItem('currentTeacherLogin');

    if (newLogin && newPassword) {
        let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
        let teacherToUpdate = teachers.find(t => t.login === currentTeacherLogin);

        if (!teacherToUpdate) {
            alert('O‘qituvchi ma’lumotlari topilmadi!');
            return;
        }

        // Ensure the new login is unique if changed
        if (newLogin !== teacherToUpdate.login && teachers.some(t => t.login === newLogin)) {
            alert('Bu login allaqachon boshqa o‘qituvchi tomonidan ishlatilmoqda!');
            return;
        }

        // Update the current teacher's data
        teacherToUpdate.login = newLogin;
        teacherToUpdate.password = newPassword;

        // Find and update the teacher in the array
        const teacherIndex = teachers.findIndex(t => t.id === teacherToUpdate.id);
        if (teacherIndex !== -1) {
            teachers[teacherIndex] = teacherToUpdate;
            localStorage.setItem('teachers', JSON.stringify(teachers));
            localStorage.setItem('currentTeacherLogin', newLogin); // Update current login in session
            alert('Profil muvaffaqiyatli yangilandi!');
            // Update displayed names
            document.getElementById('teacherNameSidebar').textContent = teacherToUpdate.name;
            document.getElementById('headerTeacherName').textContent = teacherToUpdate.name;
        }
    } else {
        alert('Iltimos, login va parolni to‘ldiring!');
    }
};

window.logout = function() {
    localStorage.removeItem('loggedInUserRole');
    localStorage.removeItem('currentAdminLogin');
    localStorage.removeItem('currentTeacherLogin');
    localStorage.removeItem('currentStudentLogin');
    window.location.href = 'index.html';
};