document.addEventListener('DOMContentLoaded', () => {
    applySavedSettings();
    updateProfilePicBorderColor(); // Apply border color on initial load
});

function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);

    // Update the state of all darkModeToggle checkboxes on the page
    document.querySelectorAll('#darkModeToggle').forEach(checkbox => {
        checkbox.checked = isDarkMode;
    });

    updateProfilePicBorderColor(); // Update border color when theme changes
}

function changeLanguage(lang) {
    localStorage.setItem('language', lang);
    alert(`Til ${lang.toUpperCase()} qilib o'rnatildi!`);
    updateLanguageTexts(lang);
}

function applySavedSettings() {
    // Apply Dark Mode
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    // Set initial state for all dark mode toggles
    document.querySelectorAll('#darkModeToggle').forEach(checkbox => {
        checkbox.checked = (savedDarkMode === 'true');
    });

    // Apply Language
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        document.querySelectorAll('#languageSelect').forEach(select => {
            select.value = savedLanguage;
        });
        updateLanguageTexts(savedLanguage);
    } else {
        // Set default to Uzbek if no language saved
        localStorage.setItem('language', 'uz');
        document.querySelectorAll('#languageSelect').forEach(select => {
            select.value = 'uz';
        });
        updateLanguageTexts('uz');
    }

    // Apply Text Color
    const savedTextColor = localStorage.getItem('textColor');
    if (savedTextColor) {
        applyTextColor(savedTextColor);
        document.querySelectorAll('#textColorSelect').forEach(select => {
            select.value = savedTextColor;
        });
    } else {
        applyTextColor('default'); // Default text color
        document.querySelectorAll('#textColorSelect').forEach(select => {
            select.value = 'default';
        });
    }
}

function updateLanguageTexts(lang) {
    const elements = {
        'uz': {
            'Admin yaratish': 'Admin yaratish',
            'Admin login': 'Admin login',
            'Admin parol': 'Admin parol',
            'Saqlash': 'Saqlash',
            'Tizimga kirish': 'Tizimga kirish',
            'Login': 'Login',
            'Parol': 'Parol',
            'Kirish': 'Kirish',
            'Admin': 'Admin',
            'O‘qituvchi': 'O‘qituvchi',
            'O‘quvchi': 'O‘quvchi',
            'O\'qituvchilar': "O'qituvchilar",
            'O\'quvchilar': "O'quvchilar",
            'Fanlar va O\'qituvchilar': "Fanlar va O'qituvchilar",
            'Profil sozlamalari': "Profil sozlamalari",
            'Chiqish': "Chiqish",
            'Admin Boshqaruv Paneli': "Admin Boshqaruv Paneli",
            'Yangi o\'qituvchi qo\'shish': "Yangi o'qituvchi qo'shish",
            'Ismi:': "Ismi:",
            'Ismi': "Ismi",
            'Login:': "Login:",
            'Parol:': "Parol:",
            'Sinf (masalan: 5A):': "Sinf (masalan: 5A):",
            'O\'qituvchi qo\'shish': "O'qituvchi qo'shish",
            'Barcha o\'qituvchilar': "Barcha o'qituvchilar",
            'Yangi o\'quvchi qo\'shish': "Yangi o'quvchi qo'shish",
            'Familiyasi:': "Familiyasi:",
            'Familiyasi': "Familiyasi",
            'O\'quvchi qo\'shish': "O'quvchi qo'shish",
            'Barcha o\'quvchilar': "Barcha o'quvchilar",
            'Fanlar va O\'qituvchilarni biriktirish': "Fanlar va O'qituvchilarni biriktirish",
            'Fan nomi': "Fan nomi",
            'O\'qituvchi': "O'qituvchi",
            'Rasm yuklash': "Rasm yuklash",
            'Yangi login': "Yangi login",
            'Yangi parol': "Yangi parol",
            'O‘qituvchi paneli': "O‘qituvchi paneli",
            'Asosiy': "Asosiy",
            'Sinf:': "Sinf:",
            'Fan tanlang:': "Fan tanlang:",
            'O\'quvchilar ro\'yxati': "O'quvchilar ro'yxati",
            'Fan tanlanmagan': "Fan tanlanmagan",
            'Ism Familiya': "Ism Familiya",
            'Davomat': "Davomat",
            'Baho': "Baho",
            'Amallar': "Amallar",
            'O\'zgarishlarni saqlash': "O'zgarishlarni saqlash",
            'O‘quvchi sahifasi': "O‘quvchi sahifasi",
            'Davomat:': "Davomat:",
            'Sana': "Sana",
            'Holat': "Holat",
            'Baholar:': "Baholar:",
            'Fan': "Fan",
            'Iltimos, to‘liq to‘ldiring.': 'Iltimos, to‘liq to‘ldiring.',
            'Admin saqlandi!': 'Admin saqlandi!',
            'O\'qituvchi muvaffaqiyatli qo\'shildi!': 'O\'qituvchi muvaffaqiyatli qo\'shildi!',
            'Login yoki Parol mavjud. Boshqasini tanlang.': 'Login yoki Parol mavjud. Boshqasini tanlang.',
            'O\'qituvchi topilmadi.': 'O\'qituvchi topilmadi.',
            'O\'qituvchi muvaffaqiyatli o\'chirildi!': 'O\'qituvchi muvaffaqiyatli o\'chirildi!',
            'O\'quvchi muvaffaqiyatli qo\'shildi!': 'O\'quvchi muvaffaqiyatli qo\'shildi!',
            'O\'quvchi topilmadi.': 'O\'quvchi topilmadi.',
            'O\'quvchi muvaffaqiyatli o\'chirildi!': 'O\'quvchi muvaffaqiyatli o\'chirildi!',
            'Fan va o\'qituvchi biriktirilishlari saqlandi!': 'Fan va o\'qituvchi biriktirilishlari saqlandi!',
            'Profil ma\'lumotlari yangilandi!': 'Profil ma\'lumotlari yangilandi!',
            'Kechirasiz, noto‘g‘ri login, parol yoki rol.': 'Kechirasiz, noto‘g‘ri login, parol yoki rol.',
            'Siz tizimdan chiqdingiz.': 'Siz tizimdan chiqdingiz.',
            'Muvaffaqiyatli yangilandi!': 'Muvaffaqiyatli yangilandi!',
            'Sozlamalar': 'Sozlamalar',
            'Til:': 'Til:',
            'Matn rangi:': 'Matn rangi:',
            'Standart': 'Standart',
            'Qora': 'Qora',
            'Qizil': 'Qizil',
            'Ko\'k': 'Ko\'k',
            'Yashil': 'Yashil',
            'Binafsha': 'Binafsha',
            'To\'q sariq': 'To\'q sariq',
            'Umumiy Sozlamalar': 'Umumiy Sozlamalar',
            'Tahrirlash': 'Tahrirlash',
            'O\'chirish': 'O\'chirish',
            'Tanlang...': 'Tanlang...'
        },
        'en': {
            'Admin yaratish': 'Create Admin',
            'Admin login': 'Admin Login',
            'Admin parol': 'Admin Password',
            'Saqlash': 'Save',
            'Tizimga kirish': 'Login to System',
            'Login': 'Login',
            'Parol': 'Password',
            'Kirish': 'Enter',
            'Admin': 'Admin',
            'O‘qituvchi': 'Teacher',
            'O‘quvchi': 'Student',
            'O\'qituvchilar': "Teachers",
            'O\'quvchilar': "Students",
            'Fanlar va O\'qituvchilar': "Subjects and Teachers",
            'Profil sozlamalari': "Profile Settings",
            'Chiqish': "Logout",
            'Admin Boshqaruv Paneli': "Admin Dashboard",
            'Yangi o\'qituvchi qo\'shish': "Add New Teacher",
            'Ismi:': "Name:",
            'Ismi': "Name",
            'Login:': "Login:",
            'Parol:': "Password:",
            'Sinf (masalan: 5A):': "Class (e.g., 5A):",
            'O\'qituvchi qo\'shish': "Add Teacher",
            'Barcha o\'qituvchilar': "All Teachers",
            'Yangi o\'quvchi qo\'shish': "Add New Student",
            'Familiyasi:': "Surname:",
            'Familiyasi': "Surname",
            'O\'quvchi qo\'shish': "Add Student",
            'Barcha o\'quvchilar': "All Students",
            'Fanlar va O\'qituvchilarni biriktirish': "Assign Subjects and Teachers",
            'Fan nomi': "Subject Name",
            'O\'qituvchi': "Teacher",
            'Rasm yuklash': "Upload Image",
            'Yangi login': "New Login",
            'Yangi parol': "New Password",
            'O‘qituvchi paneli': "Teacher Panel",
            'Asosiy': "Main",
            'Sinf:': "Class:",
            'Fan tanlang:': "Select Subject:",
            'O\'quvchilar ro\'yxati': "Student List",
            'Fan tanlanmagan': "No subject selected",
            'Ism Familiya': "Full Name",
            'Davomat': "Attendance",
            'Baho': "Grade",
            'Amallar': "Actions",
            'O\'zgarishlarni saqlash': "Save Changes",
            'O‘quvchi sahifasi': "Student Page",
            'Davomat:': "Attendance:",
            'Sana': "Date",
            'Holat': "Status",
            'Baholar:': "Grades:",
            'Fan': "Subject",
            'Iltimos, to‘liq to‘ldiring.': 'Please fill in completely.',
            'Admin saqlandi!': 'Admin saved!',
            'O\'qituvchi muvaffaqiyatli qo\'shildi!': 'Teacher successfully added!',
            'Login yoki Parol mavjud. Boshqasini tanlang.': 'Login or Password already exists. Choose another one.',
            'O\'qituvchi topilmadi.': 'Teacher not found.',
            'O\'qituvchi muvaffaqiyatli o\'chirildi!': 'Teacher successfully deleted!',
            'O\'quvchi muvaffaqiyatli qo\'shildi!': 'Student successfully added!',
            'O\'quvchi topilmadi.': 'Student not found.',
            'O\'quvchi muvaffaqiyatli o\'chirildi!': 'Student successfully deleted!',
            'Fan va o\'qituvchi biriktirilishlari saqlandi!': 'Subject and teacher assignments saved!',
            'Profil ma\'lumotlari yangilandi!': 'Profile information updated!',
            'Kechirasiz, noto‘g‘ri login, parol yoki rol.': 'Sorry, incorrect login, password, or role.',
            'Siz tizimdan chiqdingiz.': 'You have been logged out.',
            'Muvaffaqiyatli yangilandi!': 'Successfully updated!',
            'Sozlamalar': 'Settings',
            'Til:': 'Language:',
            'Matn rangi:': 'Text Color:',
            'Standart': 'Default',
            'Qora': 'Black',
            'Qizil': 'Red',
            'Ko\'k': 'Blue',
            'Yashil': 'Green',
            'Binafsha': 'Purple',
            'To\'q sariq': 'Orange',
            'Umumiy Sozlamalar': 'General Settings',
            'Tahrirlash': 'Edit',
            'O\'chirish': 'Delete',
            'Tanlang...': 'Select...'
        }
    };

    const currentLangTexts = elements[lang];
    if (currentLangTexts) {
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (currentLangTexts[key]) {
                if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                    element.placeholder = currentLangTexts[key];
                } else {
                    element.textContent = currentLangTexts[key];
                }
            }
        });

        // Update option texts in login.html if they exist
        const adminOption = document.querySelector('#role option[value="admin"]');
        if (adminOption) adminOption.textContent = currentLangTexts['Admin'];
        const teacherOption = document.querySelector('#role option[value="teacher"]');
        if (teacherOption) teacherOption.textContent = currentLangTexts['O‘qituvchi'];
        const studentOption = document.querySelector('#role option[value="student"]');
        if (studentOption) studentOption.textContent = currentLangTexts['O‘quvchi'];

        // Update option texts for language and text color selects
        document.querySelectorAll('#languageSelect option').forEach(option => {
            if (option.value === 'uz') option.textContent = "O'zbek";
            if (option.value === 'en') option.textContent = "English";
        });

        document.querySelectorAll('#textColorSelect option').forEach(option => {
            const key = option.textContent; // Use current text as key
            if (currentLangTexts[key]) {
                option.textContent = currentLangTexts[key];
            }
        });

         // Update specific alerts which are not tied to data-lang-key
        window.translateAlert = (key) => {
            return currentLangTexts[key] || key; // Return key if translation not found
        };
    }
}

function updateTextColor(color) {
    localStorage.setItem('textColor', color);
    applyTextColor(color);
}

function applyTextColor(color) {
    // Remove all existing text color classes from body
    document.body.classList.remove('text-red', 'text-blue', 'text-green', 'text-black', 'text-purple', 'text-orange');

    // Add the selected text color class if it's not 'default'
    if (color !== 'default') {
        document.body.classList.add(`text-${color}`);
    }
    // Note: The 'text-default' class behavior is handled by CSS variable --text-color
}

// Function to update the border color of profile pictures based on theme
function updateProfilePicBorderColor() {
    const profilePics = document.querySelectorAll('.profile-picture-container img, .sidebar .logo img, .profile-info img');
    // Get the computed value of --header-bg-color
    const headerBgColor = getComputedStyle(document.body).getPropertyValue('--header-bg-color').trim();
    profilePics.forEach(img => {
        img.style.borderColor = headerBgColor;
    });
}