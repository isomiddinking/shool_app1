document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Control Logic (Robust Implementation) ---
    const textColorPicker = document.getElementById('textColorPicker');
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Function to apply theme settings
    function applyTheme() {
        // Apply saved text color on page load
        const savedTextColor = localStorage.getItem('siteTextColor');
        if (savedTextColor) {
            document.body.style.setProperty('color', savedTextColor, 'important');
            if (textColorPicker) { // Check if picker exists before setting its value
                 textColorPicker.value = savedTextColor;
            }
        } else {
            // Default to a common readable color if none saved
            if (textColorPicker) {
                textColorPicker.value = '#333333';
            }
            document.body.style.setProperty('color', '#333333', 'important');
        }

        // Apply saved dark mode on page load
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'enabled') {
            document.body.classList.add('dark-mode');
            if (darkModeToggle) { // Check if toggle exists
                darkModeToggle.querySelector('.button-text').textContent = 'Light Mode';
                darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
            }
        } else {
            document.body.classList.remove('dark-mode');
            if (darkModeToggle) { // Check if toggle exists
                darkModeToggle.querySelector('.button-text').textContent = 'Dark Mode';
                darkModeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
            }
        }
    }

    // Call applyTheme once on DOMContentLoaded
    applyTheme();

    // Event listener for color picker
    if (textColorPicker) {
        textColorPicker.addEventListener('input', (event) => {
            const selectedColor = event.target.value;
            document.body.style.setProperty('color', selectedColor, 'important'); // Use setProperty with !important
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


    // --- Existing Admin Panel Logic ---

    const currentAdminLogin = localStorage.getItem('currentAdminLogin');
    if (!currentAdminLogin || localStorage.getItem('loggedInUserRole') !== 'admin') {
        window.location.href = 'index.html'; // Redirect if not logged in as admin
        return;
    }

    const adminData = JSON.parse(localStorage.getItem('admin')) || {};
    document.getElementById('adminNameSidebar').textContent = adminData.login || 'Admin';
    document.getElementById('headerAdminName').textContent = adminData.login || 'Admin';

    // Placeholder for profile picture (if you have actual upload logic, keep it)
    const adminProfilePicUrl = localStorage.getItem('adminProfilePicUrl') || "https://via.placeholder.com/80/007bff/ffffff?text=ADM";
    document.getElementById('adminProfilePic').src = adminProfilePicUrl;
    document.getElementById('headerAdminProfilePic').src = adminProfilePicUrl;

    // Initial section display
    window.showSection('teacher-management', document.querySelector('.sidebar nav ul li a.active')); // Ensure this is callable globally
    window.loadTeachers();
    window.loadStudents();
    window.loadSubjectTeacherAssignments(); // Load assignments when the page loads

    // Profile settings initialization
    document.getElementById('adminLoginEdit').value = adminData.login || '';
    document.getElementById('adminPasswordEdit').value = adminData.password || ''; // Be cautious with pre-filling passwords
    const profilePreview = document.getElementById('profilePreview');
    if (adminProfilePicUrl) {
        profilePreview.src = adminProfilePicUrl;
    }

    // Handle profile picture input change
    document.getElementById('profilePicInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePreview.src = e.target.result;
                localStorage.setItem('adminProfilePicUrl', e.target.result);
                document.getElementById('adminProfilePic').src = e.target.result;
                document.getElementById('headerAdminProfilePic').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

}); // End of DOMContentLoaded

// Global functions for admin.html
window.showSection = function(sectionId, clickedLink) {
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

window.addTeacher = function() {
    const name = document.getElementById('teacherName').value.trim();
    const login = document.getElementById('teacherLogin').value.trim();
    const password = document.getElementById('teacherPassword').value.trim();
    const className = document.getElementById('teacherClass').value.trim();

    if (name && login && password && className) {
        let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
        if (teachers.some(t => t.login === login)) {
            alert('Bu login allaqachon mavjud!');
            return;
        }
        teachers.push({ id: Date.now(), name, login, password, className });
        localStorage.setItem('teachers', JSON.stringify(teachers));
        alert('O‘qituvchi qo‘shildi!');
        document.getElementById('teacherName').value = '';
        document.getElementById('teacherLogin').value = '';
        document.getElementById('teacherPassword').value = '';
        document.getElementById('teacherClass').value = '';
        window.loadTeachers(); // Reload the list
        window.loadSubjectTeacherAssignments(); // Also refresh subject assignments as new teacher added
    } else {
        alert('Iltimos, barcha maydonlarni to‘ldiring!');
    }
};

window.loadTeachers = function() {
    const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    const teacherList = document.getElementById('teacherList');
    teacherList.innerHTML = '';
    if (teachers.length === 0) {
        teacherList.innerHTML = '<li>O‘qituvchilar mavjud emas.</li>';
        return;
    }
    teachers.forEach(teacher => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${teacher.name} (${teacher.login}) - ${teacher.className} sinf</span>
            <div>
                <button onclick="editTeacher(${teacher.id})" style="background-color: #ffc107; color: white; margin-right: 5px;">Tahrirlash</button>
                <button onclick="deleteTeacher(${teacher.id})">O‘chirish</button>
            </div>
        `;
        teacherList.appendChild(li);
    });
};

window.editTeacher = function(id) {
    let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    const teacherToEdit = teachers.find(t => t.id === id);

    if (teacherToEdit) {
        const newName = prompt('O‘qituvchining yangi ismi:', teacherToEdit.name);
        if (newName === null) return; // User cancelled

        const newLogin = prompt('O‘qituvchining yangi logini:', teacherToEdit.login);
        if (newLogin === null) return; // User cancelled

        // Check if new login already exists for another teacher
        if (newLogin !== teacherToEdit.login && teachers.some(t => t.login === newLogin)) {
            alert('Bu login allaqachon boshqa o‘qituvchi tomonidan ishlatilmoqda!');
            return;
        }

        const newPassword = prompt('O‘qituvchining yangi paroli:', teacherToEdit.password);
        if (newPassword === null) return; // User cancelled

        const newClass = prompt('O‘qituvchining yangi sinfi (masalan: 5A):', teacherToEdit.className);
        if (newClass === null) return; // User cancelled

        // Update assignments if login changes
        if (newLogin !== teacherToEdit.login) {
            let assignments = JSON.parse(localStorage.getItem('subjectTeacherAssignments')) || {};
            for (const subjectId in assignments) {
                if (assignments[subjectId] === teacherToEdit.login) {
                    assignments[subjectId] = newLogin; // Update assigned login
                }
            }
            localStorage.setItem('subjectTeacherAssignments', JSON.stringify(assignments));
        }

        teacherToEdit.name = newName;
        teacherToEdit.login = newLogin;
        teacherToEdit.password = newPassword;
        teacherToEdit.className = newClass;

        localStorage.setItem('teachers', JSON.stringify(teachers));
        alert('O‘qituvchi ma’lumotlari yangilandi!');
        window.loadTeachers(); // Reload the list
        window.loadSubjectTeacherAssignments(); // Refresh assignments in case login changed
    }
};

window.deleteTeacher = function(id) {
    if (confirm('Haqiqatan ham bu o‘qituvchini o‘chirishni xohlaysizmi? Bu unga biriktirilgan fanlarni ham o‘chiradi.')) {
        let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
        const teacherToDelete = teachers.find(t => t.id === id);
        if (teacherToDelete) {
            // Remove teacher from assignments
            let assignments = JSON.parse(localStorage.getItem('subjectTeacherAssignments')) || {};
            for (const subjectId in assignments) {
                if (assignments[subjectId] === teacherToDelete.login) {
                    delete assignments[subjectId];
                }
            }
            localStorage.setItem('subjectTeacherAssignments', JSON.stringify(assignments));
        }

        teachers = teachers.filter(t => t.id !== id);
        localStorage.setItem('teachers', JSON.stringify(teachers));
        window.loadTeachers();
        window.loadSubjectTeacherAssignments(); // Refresh assignments too
    }
};

window.addStudent = function() {
    const name = document.getElementById('studentName').value.trim();
    const surname = document.getElementById('studentSurname').value.trim();
    const login = document.getElementById('studentLogin').value.trim();
    const password = document.getElementById('studentPassword').value.trim();
    const className = document.getElementById('studentClass').value.trim();

    if (name && surname && login && password && className) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        if (students.some(s => s.login === login)) {
            alert('Bu login allaqachon mavjud!');
            return;
        }
        students.push({ id: Date.now(), name, surname, login, password, className, marks: [], attendance: {} }); // Initialize marks and attendance
        localStorage.setItem('students', JSON.stringify(students));
        alert('O‘quvchi qo‘shildi!');
        document.getElementById('studentName').value = '';
        document.getElementById('studentSurname').value = '';
        document.getElementById('studentLogin').value = '';
        document.getElementById('studentPassword').value = '';
        document.getElementById('studentClass').value = '';
        window.loadStudents(); // Reload the list
    } else {
        alert('Iltimos, barcha maydonlarni to‘ldiring!');
    }
};

window.loadStudents = function() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';
    if (students.length === 0) {
        studentList.innerHTML = '<li>O‘quvchilar mavjud emas.</li>';
        return;
    }
    students.forEach(student => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${student.name} ${student.surname} (${student.login}) - ${student.className} sinf</span>
            <div>
                <button onclick="editStudent(${student.id})" style="background-color: #ffc107; color: white; margin-right: 5px;">Tahrirlash</button>
                <button onclick="deleteStudent(${student.id})">O‘chirish</button>
            </div>
        `;
        studentList.appendChild(li);
    });
};

window.editStudent = function(id) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    const studentToEdit = students.find(s => s.id === id);

    if (studentToEdit) {
        const newName = prompt('O‘quvchining yangi ismi:', studentToEdit.name);
        if (newName === null) return; // User cancelled

        const newSurname = prompt('O‘quvchining yangi familiyasi:', studentToEdit.surname);
        if (newSurname === null) return; // User cancelled

        const newLogin = prompt('O‘quvchining yangi logini:', studentToEdit.login);
        if (newLogin === null) return; // User cancelled

        // Check if new login already exists for another student
        if (newLogin !== studentToEdit.login && students.some(s => s.login === newLogin)) {
            alert('Bu login allaqachon boshqa o‘quvchi tomonidan ishlatilmoqda!');
            return;
        }

        const newPassword = prompt('O‘quvchining yangi paroli:', studentToEdit.password);
        if (newPassword === null) return; // User cancelled

        const newClass = prompt('O‘quvchining yangi sinfi (masalan: 5A):', studentToEdit.className);
        if (newClass === null) return; // User cancelled

        studentToEdit.name = newName;
        studentToEdit.surname = newSurname;
        studentToEdit.login = newLogin;
        studentToEdit.password = newPassword;
        studentToEdit.className = newClass;

        localStorage.setItem('students', JSON.stringify(students));
        alert('O‘quvchi ma’lumotlari yangilandi!');
        window.loadStudents(); // Reload the list
    }
};


window.deleteStudent = function(id) {
    if (confirm('Haqiqatan ham bu o‘quvchini o‘chirishni xohlaysizmi?')) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students = students.filter(s => s.id !== id);
        localStorage.setItem('students', JSON.stringify(students));
        window.loadStudents();
    }
};

window.loadSubjectTeacherAssignments = function() {
    const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    const subjects = [ // Define your subjects here
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
    let assignments = JSON.parse(localStorage.getItem('subjectTeacherAssignments')) || {};

    const tableBody = document.getElementById('subjectAssignmentTable').querySelector('tbody');
    tableBody.innerHTML = '';

    subjects.forEach(subject => {
        const row = tableBody.insertRow();
        const subjectCell = row.insertCell();
        const teacherCell = row.insertCell();

        subjectCell.textContent = subject.name;

        const select = document.createElement('select');
        select.id = `subject-${subject.id}`; // Unique ID for each select
        select.innerHTML = '<option value="">O‘qituvchi tanlang</option>';

        teachers.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher.login; // Use teacher's login as value
            option.textContent = teacher.name;
            select.appendChild(option);
        });

        // Set the currently assigned teacher if exists
        if (assignments[subject.id]) {
            select.value = assignments[subject.id];
        }

        teacherCell.appendChild(select);
    });
};

window.saveSubjectTeacherAssignments = function() {
    const subjects = [
        { name: "Matematika", id: "math" }, { name: "Fizika", id: "physics" },
        { name: "Kimyo", id: "chemistry" }, { name: "Biologiya", id: "biology" },
        { name: "Tarix", id: "history" }, { name: "Adabiyot", id: "literature" },
        { name: "Ona tili", id: "motherTongue" }, { name: "Ingliz tili", id: "english" },
        { name: "Jismoniy tarbiya", id: "pe" }, { name: "Chizmachilik", id: "drawing" }
    ];
    let assignments = {};

    subjects.forEach(subject => {
        const select = document.getElementById(`subject-${subject.id}`);
        if (select && select.value) {
            assignments[subject.id] = select.value;
        }
    });

    localStorage.setItem('subjectTeacherAssignments', JSON.stringify(assignments));
    alert('Fanlar o‘qituvchilarga muvaffaqiyatli biriktirildi!');
};

window.updateAdminProfile = function() {
    const adminLoginEdit = document.getElementById('adminLoginEdit').value.trim();
    const adminPasswordEdit = document.getElementById('adminPasswordEdit').value.trim();

    if (adminLoginEdit && adminPasswordEdit) {
        localStorage.setItem('admin', JSON.stringify({ login: adminLoginEdit, password: adminPasswordEdit }));
        localStorage.setItem('currentAdminLogin', adminLoginEdit); // Update current login
        alert('Profil muvaffaqiyatli yangilandi!');
        // Update displayed names immediately
        document.getElementById('adminNameSidebar').textContent = adminLoginEdit;
        document.getElementById('headerAdminName').textContent = adminLoginEdit;
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