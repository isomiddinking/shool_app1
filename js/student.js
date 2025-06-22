document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in as student
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser || loggedInUser.role !== 'student') {
        window.location.href = 'index.html'; // Redirect to login if not student
        return;
    }

    // Populate student profile info
    const studentNameSidebar = document.getElementById('studentNameSidebar');
    const headerStudentName = document.getElementById('headerStudentName');
    const studentProfilePic = document.getElementById('studentProfilePic');
    const headerStudentProfilePic = document.getElementById('headerStudentProfilePic');
    const studentProfilePreview = document.getElementById('studentProfilePreview');

    if (studentNameSidebar) studentNameSidebar.textContent = `${loggedInUser.name} ${loggedInUser.surname}`;
    if (headerStudentName) headerStudentName.textContent = `${loggedInUser.name} ${loggedInUser.surname}`;

    const studentProfilePicUrl = localStorage.getItem(`studentProfilePic_${loggedInUser.login}`);
    if (studentProfilePicUrl) {
        if (studentProfilePic) studentProfilePic.src = studentProfilePicUrl;
        if (headerStudentProfilePic) headerStudentProfilePic.src = studentProfilePicUrl;
        if (studentProfilePreview) studentProfilePreview.src = studentProfilePicUrl;
    }

    // Initialize display of sections
    showStudentSection('main-dashboard', document.querySelector('.sidebar nav ul li a.active'));

    // Load and display classmates and marks
    loadClassmates();
    loadStudentMarks();

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

// Sidebar section switching for student
window.showStudentSection = function(sectionId, element) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    document.querySelectorAll('.sidebar nav ul li a').forEach(link => {
        link.classList.remove('active');
    });
    element.classList.add('active');
};

// Load classmates
function loadClassmates() {
    const classmatesTableBody = document.getElementById('classmatesTable').querySelector('tbody');
    classmatesTableBody.innerHTML = '';
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const students = JSON.parse(localStorage.getItem('students')) || [];

    const classmates = students.filter(s => s.class === loggedInUser.class && s.login !== loggedInUser.login);

    classmates.forEach(student => {
        const row = classmatesTableBody.insertRow();
        row.insertCell().textContent = `${student.name} ${student.surname}`;
        row.insertCell().textContent = student.login;
    });
}

// Load student's marks
function loadStudentMarks() {
    const marksTableBody = document.getElementById('marksTable').querySelector('tbody');
    marksTableBody.innerHTML = '';
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];

    const currentStudent = students.find(s => s.login === loggedInUser.login);

    if (currentStudent && currentStudent.marks) {
        currentStudent.marks.forEach(mark => {
            const subject = subjects.find(s => s.id === mark.subjectId);
            if (subject) {
                const row = marksTableBody.insertRow();
                row.insertCell().textContent = subject.name;
                row.insertCell().textContent = mark.date;
                row.insertCell().textContent = mark.mark;
            }
        });
    }
}


// --- Student Profile Settings ---
window.updateStudentProfile = function() {
    const studentLoginEdit = document.getElementById('studentLoginEdit').value;
    const studentPasswordEdit = document.getElementById('studentPasswordEdit').value;
    const studentProfilePicInput = document.getElementById('studentProfilePicInput');

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let students = JSON.parse(localStorage.getItem('students')) || [];
    const currentStudentIndex = students.findIndex(s => s.login === loggedInUser.login);

    if (currentStudentIndex !== -1) {
        if (studentLoginEdit && studentPasswordEdit) {
            // Check for duplicate login during edit
            if (students.some((s, index) => s.login === studentLoginEdit && index !== currentStudentIndex)) {
                alert('Bu login allaqachon mavjud. Iltimos, boshqa login tanlang.');
                return;
            }
            students[currentStudentIndex].login = studentLoginEdit;
            students[currentStudentIndex].password = studentPasswordEdit;
            localStorage.setItem('students', JSON.stringify(students));

            // Update loggedInUser in localStorage to reflect new login
            loggedInUser.login = studentLoginEdit;
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

            if (studentNameSidebar) studentNameSidebar.textContent = `${loggedInUser.name} ${loggedInUser.surname}`;
            if (headerStudentName) headerStudentName.textContent = `${loggedInUser.name} ${loggedInUser.surname}`;

            alert('Profil logini va paroli yangilandi!');
        } else {
            alert('Login va parolni to\'ldiring.');
        }

        if (studentProfilePicInput.files.length > 0) {
            const file = studentProfilePicInput.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                localStorage.setItem(`studentProfilePic_${loggedInUser.login}`, imageUrl); // Save based on current login
                if (studentProfilePic) studentProfilePic.src = imageUrl;
                if (headerStudentProfilePic) headerStudentProfilePic.src = imageUrl;
                if (studentProfilePreview) studentProfilePreview.src = imageUrl;
                alert('Profil rasmi yangilandi!');
            };
            reader.readAsDataURL(file);
        }
    }
};

// Event listener for student profile picture input
document.addEventListener('DOMContentLoaded', () => {
    const studentProfilePicInput = document.getElementById('studentProfilePicInput');
    if (studentProfilePicInput) {
        studentProfilePicInput.addEventListener('change', function() {
            const [file] = studentProfilePicInput.files;
            if (file) {
                studentProfilePreview.src = URL.createObjectURL(file);
            }
        });
    }
});