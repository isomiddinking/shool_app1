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


    // --- Existing Student Panel Logic ---
    const currentStudentLogin = localStorage.getItem('currentStudentLogin');
    if (!currentStudentLogin || localStorage.getItem('loggedInUserRole') !== 'student') {
        window.location.href = 'index.html'; // Redirect if not logged in as student
        return;
    }

    let students = JSON.parse(localStorage.getItem('students')) || [];
    let currentStudent = students.find(s => s.login === currentStudentLogin);

    if (currentStudent) {
        document.getElementById('studentNameSidebar').textContent = `${currentStudent.name} ${currentStudent.surname}`;
        document.getElementById('headerStudentName').textContent = `${currentStudent.name} ${currentStudent.surname}`;

        // Placeholder for profile picture
        const studentProfilePicUrl = localStorage.getItem(`studentProfilePicUrl_${currentStudent.login}`) || "https://via.placeholder.com/80/007bff/ffffff?text=STU";
        document.getElementById('studentProfilePic').src = studentProfilePicUrl;
        document.getElementById('headerStudentProfilePic').src = studentProfilePicUrl;
        document.getElementById('studentProfilePreview').src = studentProfilePicUrl;

        // Initial section display
        window.showStudentSection('main-dashboard', document.querySelector('.sidebar nav ul li a.active'));
        window.loadClassmates(currentStudent.className);
        window.loadStudentMarks(currentStudent.login);

        // Profile settings initialization
        document.getElementById('studentLoginEdit').value = currentStudent.login;
        document.getElementById('studentPasswordEdit').value = currentStudent.password;

        // Handle profile picture input change
        document.getElementById('studentProfilePicInput').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('studentProfilePreview').src = e.target.result;
                    localStorage.setItem(`studentProfilePicUrl_${currentStudent.login}`, e.target.result);
                    document.getElementById('studentProfilePic').src = e.target.result;
                    document.getElementById('headerStudentProfilePic').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

    } else {
        alert('O‘quvchi ma’lumotlari topilmadi!');
        window.location.href = 'index.html';
    }

}); // End of DOMContentLoaded

// Global functions for student.html
window.showStudentSection = function(sectionId, clickedLink) {
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

window.loadClassmates = function(className) {
    const allStudents = JSON.parse(localStorage.getItem('students')) || [];
    const currentStudentLogin = localStorage.getItem('currentStudentLogin');
    const classmates = allStudents.filter(s => s.className === className && s.login !== currentStudentLogin);
    const classmatesTableBody = document.getElementById('classmatesTable').querySelector('tbody');
    classmatesTableBody.innerHTML = '';

    if (classmates.length === 0) {
        classmatesTableBody.innerHTML = '<tr><td colspan="2">Sinfdoshlar mavjud emas.</td></tr>';
        return;
    }

    classmates.forEach(mate => {
        const row = classmatesTableBody.insertRow();
        row.insertCell().textContent = `${mate.name} ${mate.surname}`;
        row.insertCell().textContent = mate.login;
    });
};

window.loadStudentMarks = function(studentLogin) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(s => s.login === studentLogin);
    const marksTableBody = document.getElementById('marksTable').querySelector('tbody');
    marksTableBody.innerHTML = '';

    if (student && student.marks && student.marks.length > 0) {
        student.marks.forEach(mark => {
            const row = marksTableBody.insertRow();
            row.insertCell().textContent = mark.subject;
            row.insertCell().textContent = mark.date;
            row.insertCell().textContent = mark.grade;
        });
    } else {
        marksTableBody.innerHTML = '<tr><td colspan="3">Baholar mavjud emas.</td></tr>';
    }
};

window.updateStudentProfile = function() {
    const newLogin = document.getElementById('studentLoginEdit').value.trim();
    const newPassword = document.getElementById('studentPasswordEdit').value.trim();
    const currentStudentLogin = localStorage.getItem('currentStudentLogin');

    if (newLogin && newPassword) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        let currentStudent = students.find(s => s.login === currentStudentLogin);

        if (!currentStudent) {
            alert('O‘quvchi ma’lumotlari topilmadi!');
            return;
        }

        // Ensure the new login is unique if changed
        if (newLogin !== currentStudent.login && students.some(s => s.login === newLogin)) {
            alert('Bu login allaqachon boshqa o‘quvchi tomonidan ishlatilmoqda!');
            return;
        }

        // Update the current student's data
        currentStudent.login = newLogin;
        currentStudent.password = newPassword;

        // Find and update the student in the array
        const studentIndex = students.findIndex(s => s.id === currentStudent.id);
        if (studentIndex !== -1) {
            students[studentIndex] = currentStudent;
            localStorage.setItem('students', JSON.stringify(students));
            localStorage.setItem('currentStudentLogin', newLogin); // Update current login in session
            alert('Profil muvaffaqiyatli yangilandi!');
            // Update displayed names
            document.getElementById('studentNameSidebar').textContent = `${currentStudent.name} ${currentStudent.surname}`;
            document.getElementById('headerStudentName').textContent = `${currentStudent.name} ${currentStudent.surname}`;
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