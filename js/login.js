document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const login = document.getElementById('login').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            if (role === 'admin' && login === 'admin' && password === '1234') {
                localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin', login: 'admin' }));
                window.location.href = 'admin.html';
            } else if (role === 'teacher') {
                const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
                const foundTeacher = teachers.find(t => t.login === login && t.password === password);
                if (foundTeacher) {
                    localStorage.setItem('loggedInUser', JSON.stringify({ role: 'teacher', login: login, name: foundTeacher.name }));
                    window.location.href = 'teacher.html';
                } else {
                    alert('Noto\'g\'ri login yoki parol, yoki o\'qituvchi topilmadi.');
                }
            } else if (role === 'student') {
                const students = JSON.parse(localStorage.getItem('students')) || [];
                const foundStudent = students.find(s => s.login === login && s.password === password);
                if (foundStudent) {
                    localStorage.setItem('loggedInUser', JSON.stringify({ role: 'student', login: login, name: foundStudent.name, surname: foundStudent.surname, class: foundStudent.class }));
                    window.location.href = 'student.html';
                } else {
                    alert('Noto\'g\'ri login yoki parol, yoki o\'quvchi topilmadi.');
                }
            } else {
                alert('Noto\'g\'ri login, parol yoki rol.');
            }
        });
    }

    // Common logout function
    window.logout = function() {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    };

    // Dark mode and text color functionality for all pages
    const darkModeToggle = document.getElementById('darkModeToggle');
    const textColorPicker = document.getElementById('textColorPicker');

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
            updateDarkModeButtonText(isDarkMode);
        });

        // Apply dark mode on load
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
        }
        updateDarkModeButtonText(savedDarkMode);
    }

    if (textColorPicker) {
        textColorPicker.addEventListener('input', (event) => {
            document.body.style.color = event.target.value;
            localStorage.setItem('textColor', event.target.value);
        });

        // Apply text color on load
        const savedTextColor = localStorage.getItem('textColor');
        if (savedTextColor) {
            document.body.style.color = savedTextColor;
            textColorPicker.value = savedTextColor;
        }
    }

    function updateDarkModeButtonText(isDarkMode) {
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
});