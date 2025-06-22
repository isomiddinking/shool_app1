document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in as admin
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser || loggedInUser.role !== 'admin') {
        window.location.href = 'index.html'; // Redirect to login if not admin
        return;
    }

    // Populate admin profile info
    const adminNameSidebar = document.getElementById('adminNameSidebar');
    const headerAdminName = document.getElementById('headerAdminName');
    const adminProfilePic = document.getElementById('adminProfilePic');
    const headerAdminProfilePic = document.getElementById('headerAdminProfilePic');
    const profilePreview = document.getElementById('profilePreview');

    if (adminNameSidebar) adminNameSidebar.textContent = loggedInUser.login;
    if (headerAdminName) headerAdminName.textContent = loggedInUser.login;

    const adminProfilePicUrl = localStorage.getItem('adminProfilePic');
    if (adminProfilePicUrl) {
        if (adminProfilePic) adminProfilePic.src = adminProfilePicUrl;
        if (headerAdminProfilePic) headerAdminProfilePic.src = adminProfilePicUrl;
        if (profilePreview) profilePreview.src = adminProfilePicUrl;
    }

    // Initialize display of sections
    showSection('teacher-management', document.querySelector('.sidebar nav ul li a.active'));

    // Load existing data
    loadTeachers();
    loadStudents();
    loadSubjects(); // Assuming subjects are managed somewhere or hardcoded
    renderSubjectTeacherAssignments();

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


// Sidebar section switching
window.showSection = function(sectionId, element) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    document.querySelectorAll('.sidebar nav ul li a').forEach(link => {
        link.classList.remove('active');
    });
    element.classList.add('active');
};


// --- Teacher Management ---
window.addTeacher = function() {
    const name = document.getElementById('teacherName').value;
    const login = document.getElementById('teacherLogin').value;
    const password = document.getElementById('teacherPassword').value;
    const teacherClass = document.getElementById('teacherClass').value;

    if (name && login && password && teacherClass) {
        let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
        // Check for duplicate login
        if (teachers.some(t => t.login === login)) {
            alert('Bu login allaqachon mavjud. Iltimos, boshqa login tanlang.');
            return;
        }
        teachers.push({ id: Date.now(), name, login, password, class: teacherClass, profilePic: "https://via.placeholder.com/80/007bff/ffffff?text=TCH" });
        localStorage.setItem('teachers', JSON.stringify(teachers));
        alert('O\'qituvchi qo\'shildi!');
        document.getElementById('teacherName').value = '';
        document.getElementById('teacherLogin').value = '';
        document.getElementById('teacherPassword').value = '';
        document.getElementById('teacherClass').value = '';
        loadTeachers(); // Refresh list
        renderSubjectTeacherAssignments(); // Update assignments if new teacher is added
    } else {
        alert('Iltimos, barcha maydonlarni to\'ldiring.');
    }
};

function loadTeachers() {
    const teacherList = document.getElementById('teacherList');
    teacherList.innerHTML = '';
    const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    teachers.forEach(teacher => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${teacher.name} (${teacher.class}) - Login: ${teacher.login}</span>
            <div>
                <button onclick="editTeacher(${teacher.id})">Tahrirlash</button>
                <button onclick="deleteTeacher(${teacher.id})">O'chirish</button>
            </div>
        `;
        teacherList.appendChild(li);
    });
}

window.editTeacher = function(id) {
    let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    const teacher = teachers.find(t => t.id === id);
    if (teacher) {
        const newName = prompt('Yangi ism kiriting:', teacher.name);
        const newLogin = prompt('Yangi login kiriting:', teacher.login);
        const newPassword = prompt('Yangi parol kiriting:', teacher.password);
        const newClass = prompt('Yangi sinf kiriting (masalan: 5A):', teacher.class);

        if (newName !== null && newLogin !== null && newPassword !== null && newClass !== null) {
            // Check for duplicate login during edit, excluding current teacher's login
            if (teachers.some(t => t.login === newLogin && t.id !== id)) {
                alert('Bu login allaqachon mavjud. Iltimos, boshqa login tanlang.');
                return;
            }
            teacher.name = newName;
            teacher.login = newLogin;
            teacher.password = newPassword;
            teacher.class = newClass;
            localStorage.setItem('teachers', JSON.stringify(teachers));
            alert('O\'qituvchi ma\'lumotlari yangilandi!');
            loadTeachers();
            renderSubjectTeacherAssignments();
        }
    }
};

window.deleteTeacher = function(id) {
    if (confirm('Haqiqatan ham bu o\'qituvchini o\'chirmoqchimisiz?')) {
        let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
        teachers = teachers.filter(t => t.id !== id);
        localStorage.setItem('teachers', JSON.stringify(teachers));
        alert('O\'qituvchi o\'chirildi.');
        loadTeachers();
        renderSubjectTeacherAssignments();
    }
};


// --- Student Management ---
window.addStudent = function() {
    const name = document.getElementById('studentName').value;
    const surname = document.getElementById('studentSurname').value;
    const login = document.getElementById('studentLogin').value;
    const password = document.getElementById('studentPassword').value;
    const studentClass = document.getElementById('studentClass').value;

    if (name && surname && login && password && studentClass) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        // Check for duplicate login
        if (students.some(s => s.login === login)) {
            alert('Bu login allaqachon mavjud. Iltimos, boshqa login tanlang.');
            return;
        }
        students.push({ id: Date.now(), name, surname, login, password, class: studentClass, marks: [], attendance: [], profilePic: "https://via.placeholder.com/80/007bff/ffffff?text=STU" });
        localStorage.setItem('students', JSON.stringify(students));
        alert('O\'quvchi qo\'shildi!');
        document.getElementById('studentName').value = '';
        document.getElementById('studentSurname').value = '';
        document.getElementById('studentLogin').value = '';
        document.getElementById('studentPassword').value = '';
        document.getElementById('studentClass').value = '';
        loadStudents(); // Refresh list
    } else {
        alert('Iltimos, barcha maydonlarni to\'ldiring.');
    }
};

function loadStudents() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';
    const students = JSON.parse(localStorage.getItem('students')) || [];
    students.forEach(student => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${student.name} ${student.surname} (${student.class}) - Login: ${student.login}</span>
            <div>
                <button onclick="editStudent(${student.id})">Tahrirlash</button>
                <button onclick="deleteStudent(${student.id})">O'chirish</button>
            </div>
        `;
        studentList.appendChild(li);
    });
}

window.editStudent = function(id) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(s => s.id === id);
    if (student) {
        const newName = prompt('Yangi ism kiriting:', student.name);
        const newSurname = prompt('Yangi familiya kiriting:', student.surname);
        const newLogin = prompt('Yangi login kiriting:', student.login);
        const newPassword = prompt('Yangi parol kiriting:', student.password);
        const newClass = prompt('Yangi sinf kiriting (masalan: 5A):', student.class);

        if (newName !== null && newSurname !== null && newLogin !== null && newPassword !== null && newClass !== null) {
            // Check for duplicate login during edit, excluding current student's login
            if (students.some(s => s.login === newLogin && s.id !== id)) {
                alert('Bu login allaqachon mavjud. Iltimos, boshqa login tanlang.');
                return;
            }
            student.name = newName;
            student.surname = newSurname;
            student.login = newLogin;
            student.password = newPassword;
            student.class = newClass;
            localStorage.setItem('students', JSON.stringify(students));
            alert('O\'quvchi ma\'lumotlari yangilandi!');
            loadStudents();
        }
    }
};

window.deleteStudent = function(id) {
    if (confirm('Haqiqatan ham bu o\'quvchini o\'chirmoqchimisiz?')) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students = students.filter(s => s.id !== id);
        localStorage.setItem('students', JSON.stringify(students));
        alert('O\'quvchi o\'chirildi.');
        loadStudents();
    }
};


// --- Subject & Teacher Assignment ---
// Dummy subjects - in a real app, these might be managed in a separate section
function loadSubjects() {
    let subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    if (subjects.length === 0) {
        subjects = [
            { id: 1, name: "Matematika" },
            { id: 2, name: "Ona tili" },
            { id: 3, name: "Adabiyot" },
            { id: 4, name: "Ingliz tili" },
            { id: 5, name: "Jismoniy tarbiya" }
        ];
        localStorage.setItem('subjects', JSON.stringify(subjects));
    }
}

function renderSubjectTeacherAssignments() {
    const tableBody = document.getElementById('subjectAssignmentTable').querySelector('tbody');
    tableBody.innerHTML = '';
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    const assignments = JSON.parse(localStorage.getItem('subjectTeacherAssignments')) || {};

    subjects.forEach(subject => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = subject.name;

        const teacherCell = row.insertCell();
        const select = document.createElement('select');
        select.id = `subject-${subject.id}-teacher`;

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'O\'qituvchi tanlang';
        select.appendChild(defaultOption);

        teachers.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher.id;
            option.textContent = teacher.name;
            select.appendChild(option);
        });

        // Set the currently assigned teacher
        if (assignments[subject.id]) {
            select.value = assignments[subject.id];
        }

        teacherCell.appendChild(select);
    });
}

window.saveSubjectTeacherAssignments = function() {
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const newAssignments = {};

    subjects.forEach(subject => {
        const select = document.getElementById(`subject-${subject.id}-teacher`);
        if (select && select.value) {
            newAssignments[subject.id] = select.value;
        }
    });

    localStorage.setItem('subjectTeacherAssignments', JSON.stringify(newAssignments));
    alert('Fanlar va o\'qituvchilar biriktirilishi saqlandi!');
};


// --- Admin Profile Settings ---
window.updateAdminProfile = function() {
    const adminLoginEdit = document.getElementById('adminLoginEdit').value;
    const adminPasswordEdit = document.getElementById('adminPasswordEdit').value;
    const profilePicInput = document.getElementById('profilePicInput');

    if (adminLoginEdit && adminPasswordEdit) {
        // In this simplified example, admin credentials are hardcoded in login.js
        // For a real application, you'd need a backend to update actual admin credentials securely.
        // Here, we're just updating the displayed login/password in the UI for demonstration.

        // Update displayed login name
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        loggedInUser.login = adminLoginEdit; // Update local storage for display purposes
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        if (adminNameSidebar) adminNameSidebar.textContent = adminLoginEdit;
        if (headerAdminName) headerAdminName.textContent = adminLoginEdit;

        alert('Admin logini va paroli (faqat UIda) yangilandi!'); // Clarify it's UI update
    } else {
        alert('Login va parolni to\'ldiring.');
    }

    if (profilePicInput.files.length > 0) {
        const file = profilePicInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            localStorage.setItem('adminProfilePic', imageUrl);
            if (adminProfilePic) adminProfilePic.src = imageUrl;
            if (headerAdminProfilePic) headerAdminProfilePic.src = imageUrl;
            if (profilePreview) profilePreview.src = imageUrl;
            alert('Profil rasmi yangilandi!');
        };
        reader.readAsDataURL(file);
    }
};

// Event listener for profile picture input
document.addEventListener('DOMContentLoaded', () => {
    const profilePicInput = document.getElementById('profilePicInput');
    if (profilePicInput) {
        profilePicInput.addEventListener('change', function() {
            const [file] = profilePicInput.files;
            if (file) {
                profilePreview.src = URL.createObjectURL(file);
            }
        });
    }
});