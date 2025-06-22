document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in as teacher
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser || loggedInUser.role !== 'teacher') {
        window.location.href = 'index.html'; // Redirect to login if not teacher
        return;
    }

    // Populate teacher profile info
    const teacherNameSidebar = document.getElementById('teacherNameSidebar');
    const headerTeacherName = document.getElementById('headerTeacherName');
    const teacherProfilePic = document.getElementById('teacherProfilePic');
    const headerTeacherProfilePic = document.getElementById('headerTeacherProfilePic');
    const teacherProfilePreview = document.getElementById('teacherProfilePreview');

    if (teacherNameSidebar) teacherNameSidebar.textContent = loggedInUser.name;
    if (headerTeacherName) headerTeacherName.textContent = loggedInUser.name;

    const teacherProfilePicUrl = localStorage.getItem(`teacherProfilePic_${loggedInUser.login}`);
    if (teacherProfilePicUrl) {
        if (teacherProfilePic) teacherProfilePic.src = teacherProfilePicUrl;
        if (headerTeacherProfilePic) headerTeacherProfilePic.src = teacherProfilePicUrl;
        if (teacherProfilePreview) teacherProfilePreview.src = teacherProfilePicUrl;
    }

    // Initialize display of sections
    showTeacherSection('main-dashboard', document.querySelector('.sidebar nav ul li a.active'));

    // Load and populate subjects and students for the teacher
    loadSubjectsForTeacher();
    document.getElementById('subjectSelect').addEventListener('change', loadStudentsForSelectedSubject);

    // Dark Mode & Text Color (as per login.js, ensure it's also initialized here if needed directly)
    const darkModeToggle = document.getElementById('darkModeToggle');
    const textColorPicker = document.getElementById('textColorPicker');

    if (darkModeToggle) {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
        }
        updateDarkModeButtonText(savedDarkMode); // Function from login.js
    }

    if (textColorPicker) {
        const savedTextColor = localStorage.getItem('textColor');
        if (savedTextColor) {
            document.body.style.color = savedTextColor;
            textColorPicker.value = savedTextColor;
        }
    }
});

// Helper function to update Dark Mode button text (duplicated from login.js for standalone use)
function updateDarkModeButtonText(isDarkMode) {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        const buttonText = darkModeToggle.querySelector('.button-text');
        if (buttonText) {
            buttonText.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
        }
        const icon = darkModeToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-moon', 'fa-sun');
            icon.classList.add(isDarkMode ? 'fa-sun' : 'fa-moon');
        }
    }
}

// Sidebar section switching for teacher
window.showTeacherSection = function(sectionId, element) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    document.querySelectorAll('.sidebar nav ul li a').forEach(link => {
        link.classList.remove('active');
    });
    element.classList.add('active');
};

// Load subjects assigned to the current teacher
function loadSubjectsForTeacher() {
    const subjectSelect = document.getElementById('subjectSelect');
    subjectSelect.innerHTML = '<option value="">Fanni tanlang</option>'; // Reset options

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const assignments = JSON.parse(localStorage.getItem('subjectTeacherAssignments')) || {};

    const currentTeacher = teachers.find(t => t.login === loggedInUser.login);

    if (currentTeacher) {
        // Find subjects assigned to this teacher
        const assignedSubjectIds = Object.keys(assignments).filter(subjectId => {
            return assignments[subjectId] == currentTeacher.id;
        });

        assignedSubjectIds.forEach(subjectId => {
            const subject = subjects.find(s => s.id == subjectId);
            if (subject) {
                const option = document.createElement('option');
                option.value = subject.id;
                option.textContent = subject.name;
                subjectSelect.appendChild(option);
            }
        });
    }
}

// Load students for the selected subject and current teacher's classes
function loadStudentsForSelectedSubject() {
    const studentTableBody = document.getElementById('studentTable').querySelector('tbody');
    studentTableBody.innerHTML = ''; // Clear existing students

    const selectedSubjectId = document.getElementById('subjectSelect').value;
    if (!selectedSubjectId) return;

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const teachers = JSON.parse(localStorage.getItem('teachers')) || [];

    const currentTeacher = teachers.find(t => t.login === loggedInUser.login);

    if (currentTeacher) {
        const studentsInTeacherClasses = students.filter(s => s.class === currentTeacher.class);

        studentsInTeacherClasses.forEach(student => {
            const row = studentTableBody.insertRow();
            row.insertCell().textContent = `${student.name} ${student.surname}`;

            // Attendance (simple checkbox)
            const attendanceCell = row.insertCell();
            const attendanceCheckbox = document.createElement('input');
            attendanceCheckbox.type = 'checkbox';
            attendanceCheckbox.checked = student.attendance.some(a => a.subjectId == selectedSubjectId && a.date === new Date().toISOString().slice(0, 10)); // Check if attendance already marked for today
            attendanceCheckbox.dataset.studentId = student.id;
            attendanceCheckbox.dataset.subjectId = selectedSubjectId;
            attendanceCell.appendChild(attendanceCheckbox);

            // Marks (input field for grade)
            const markCell = row.insertCell();
            const markInput = document.createElement('input');
            markInput.type = 'number';
            markInput.min = '1';
            markInput.max = '5';
            markInput.style.width = '60px';
            const existingMark = student.marks.find(m => m.subjectId == selectedSubjectId);
            if (existingMark) {
                markInput.value = existingMark.mark;
            }
            markInput.dataset.studentId = student.id;
            markInput.dataset.subjectId = selectedSubjectId;
            markCell.appendChild(markInput);

            // Actions (e.g., Save for individual student - though we have a global save)
            const actionsCell = row.insertCell();
            // You can add individual save buttons here if needed, or rely on the global "O'zgarishlarni saqlash" button
        });
    }
}

window.saveChanges = function() {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    const selectedSubjectId = document.getElementById('subjectSelect').value;
    const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    if (!selectedSubjectId) {
        alert('Iltimos, fanni tanlang!');
        return;
    }

    document.querySelectorAll('#studentTable tbody tr').forEach(row => {
        const studentId = row.querySelector('input[type="checkbox"]').dataset.studentId;
        const attendanceCheckbox = row.querySelector('input[type="checkbox"]');
        const markInput = row.querySelector('input[type="number"]');

        const student = students.find(s => s.id == studentId);
        if (student) {
            // Update attendance
            const existingAttendanceIndex = student.attendance.findIndex(a => a.subjectId == selectedSubjectId && a.date === currentDate);
            if (attendanceCheckbox.checked) {
                if (existingAttendanceIndex === -1) {
                    student.attendance.push({ subjectId: parseInt(selectedSubjectId), date: currentDate, present: true });
                } else {
                    student.attendance[existingAttendanceIndex].present = true;
                }
            } else {
                // If unchecked, remove or mark as absent
                if (existingAttendanceIndex !== -1) {
                    student.attendance.splice(existingAttendanceIndex, 1); // Remove if unchecked
                }
            }

            // Update mark
            const newMark = markInput.value ? parseInt(markInput.value) : null;
            const existingMarkIndex = student.marks.findIndex(m => m.subjectId == selectedSubjectId);
            if (newMark !== null) {
                if (existingMarkIndex === -1) {
                    student.marks.push({ subjectId: parseInt(selectedSubjectId), mark: newMark, date: currentDate });
                } else {
                    student.marks[existingMarkIndex].mark = newMark;
                    student.marks[existingMarkIndex].date = currentDate; // Update date of last mark
                }
            } else {
                // If mark is cleared, remove it
                if (existingMarkIndex !== -1) {
                    student.marks.splice(existingMarkIndex, 1);
                }
            }
        }
    });

    localStorage.setItem('students', JSON.stringify(students));
    alert('O\'zgarishlar saqlandi!');
    loadStudentsForSelectedSubject(); // Re-render to show updated state
};


// --- Teacher Profile Settings ---
window.updateTeacherProfile = function() {
    const teacherLoginEdit = document.getElementById('teacherLoginEdit').value;
    const teacherPasswordEdit = document.getElementById('teacherPasswordEdit').value;
    const teacherProfilePicInput = document.getElementById('teacherProfilePicInput');

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    const currentTeacherIndex = teachers.findIndex(t => t.login === loggedInUser.login);

    if (currentTeacherIndex !== -1) {
        if (teacherLoginEdit && teacherPasswordEdit) {
            // Check for duplicate login during edit
            if (teachers.some((t, index) => t.login === teacherLoginEdit && index !== currentTeacherIndex)) {
                alert('Bu login allaqachon mavjud. Iltimos, boshqa login tanlang.');
                return;
            }
            teachers[currentTeacherIndex].login = teacherLoginEdit;
            teachers[currentTeacherIndex].password = teacherPasswordEdit;
            localStorage.setItem('teachers', JSON.stringify(teachers));

            // Update loggedInUser in localStorage to reflect new login
            loggedInUser.login = teacherLoginEdit;
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

            if (teacherNameSidebar) teacherNameSidebar.textContent = loggedInUser.name;
            if (headerTeacherName) headerTeacherName.textContent = loggedInUser.name;

            alert('Profil logini va paroli yangilandi!');
        } else {
            alert('Login va parolni to\'ldiring.');
        }

        if (teacherProfilePicInput.files.length > 0) {
            const file = teacherProfilePicInput.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                localStorage.setItem(`teacherProfilePic_${loggedInUser.login}`, imageUrl); // Save based on current login
                if (teacherProfilePic) teacherProfilePic.src = imageUrl;
                if (headerTeacherProfilePic) headerTeacherProfilePic.src = imageUrl;
                if (teacherProfilePreview) teacherProfilePreview.src = imageUrl;
                alert('Profil rasmi yangilandi!');
            };
            reader.readAsDataURL(file);
        }
    }
};

// Event listener for teacher profile picture input
document.addEventListener('DOMContentLoaded', () => {
    const teacherProfilePicInput = document.getElementById('teacherProfilePicInput');
    if (teacherProfilePicInput) {
        teacherProfilePicInput.addEventListener('change', function() {
            const [file] = teacherProfilePicInput.files;
            if (file) {
                teacherProfilePreview.src = URL.createObjectURL(file);
            }
        });
    }
});