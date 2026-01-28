/**
 * INITIAL DATA STRUCTURES
 */
const COLLECTIONS = {
    users: JSON.parse(localStorage.getItem('edu_users')) || [
        { id: 'ADM001', name: 'Super Admin', role: 'admin', password: 'admin123', email: 'admin@eduflow.edu' }
    ],
    students: JSON.parse(localStorage.getItem('edu_students')) || [],
    staff: JSON.parse(localStorage.getItem('edu_staff')) || [],
    departments: JSON.parse(localStorage.getItem('edu_departments')) || [
        { id: 'CSE', name: 'Computer Science', subjects: [] },
        { id: 'ECE', name: 'Electronics', subjects: [] }
    ],
    attendance: JSON.parse(localStorage.getItem('edu_attendance')) || [],
    marks: JSON.parse(localStorage.getItem('edu_marks')) || [],
    timetable: JSON.parse(localStorage.getItem('edu_timetable')) || []
};

let currentUser = null;

// Save Data Helper
function saveData() {
    localStorage.setItem('edu_users', JSON.stringify(COLLECTIONS.users));
    localStorage.setItem('edu_students', JSON.stringify(COLLECTIONS.students));
    localStorage.setItem('edu_staff', JSON.stringify(COLLECTIONS.staff));
    localStorage.setItem('edu_departments', JSON.stringify(COLLECTIONS.departments));
    localStorage.setItem('edu_attendance', JSON.stringify(COLLECTIONS.attendance));
    localStorage.setItem('edu_marks', JSON.stringify(COLLECTIONS.marks));
    localStorage.setItem('edu_timetable', JSON.stringify(COLLECTIONS.timetable));
}

function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.style.backgroundColor = isError ? '#ef4444' : '#1f2937';
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

/**
 * AUTHENTICATION LOGIC
 */
function handleLogin() {
    const id = document.getElementById('login-id').value;
    const pass = document.getElementById('login-password').value;

    const user = COLLECTIONS.users.find(u => u.id === id && u.password === pass);
    if (user) {
        currentUser = user;
        initDashboard();
    } else {
        showToast("Invalid credentials", true);
    }
}

function handleLogout() {
    currentUser = null;
    document.getElementById('auth-view').classList.remove('hidden');
    document.getElementById('dashboard-view').classList.add('hidden');
}

/**
 * DASHBOARD INIT
 */
function initDashboard() {
    document.getElementById('auth-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');
    document.getElementById('header-user-name').innerText = currentUser.name;
    document.getElementById('user-role-display').innerText = `${currentUser.role} Dashboard`;

    renderSidebar();
    navigateTo('overview');
}

function renderSidebar() {
    const nav = document.getElementById('sidebar-nav');
    let links = [];

    if (currentUser.role === 'admin') {
        links = [
            { id: 'overview', icon: 'fa-chart-line', label: 'Overview' },
            { id: 'students', icon: 'fa-user-graduate', label: 'Manage Students' },
            { id: 'staff', icon: 'fa-user-tie', label: 'Manage Staff' },
            { id: 'subjects', icon: 'fa-book', label: 'Departments & Subjects' },
            { id: 'timetable_mgr', icon: 'fa-calendar-alt', label: 'Timetables' },
            { id: 'attendance_report', icon: 'fa-clipboard-list', label: 'Attendance Report' }
        ];
    } else if (currentUser.role === 'staff') {
        links = [
            { id: 'staff_timetable', icon: 'fa-calendar-day', label: 'My Timetable' },
            { id: 'mark_attendance', icon: 'fa-check-circle', label: 'Mark Attendance' },
            { id: 'enter_marks', icon: 'fa-award', label: 'Enter Marks' }
        ];
    } else if (currentUser.role === 'student') {
        links = [
            { id: 'student_marks', icon: 'fa-star', label: 'My Marks' },
            { id: 'student_attendance', icon: 'fa-percent', label: 'Attendance' },
            { id: 'student_timetable', icon: 'fa-clock', label: 'Timetable' }
        ];
    }

    nav.innerHTML = links.map(link => `
        <button onclick="navigateTo('${link.id}')" id="nav-${link.id}" class="sidebar-link flex items-center space-x-3 w-full p-3 rounded transition hover:bg-slate-800">
            <i class="fas ${link.icon} w-5"></i>
            <span>${link.label}</span>
        </button>
    `).join('');
}

/**
 * NAVIGATION & ROUTING
 */
function navigateTo(pageId) {
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    const activeNav = document.getElementById(`nav-${pageId}`);
    if (activeNav) activeNav.classList.add('active');

    const title = document.getElementById('page-title');
    const container = document.getElementById('content-container');

    switch (pageId) {
        case 'overview': renderOverview(container, title); break;
        case 'students': renderManageStudents(container, title); break;
        case 'staff': renderManageStaff(container, title); break;
        case 'subjects': renderSubjects(container, title); break;
        case 'timetable_mgr': renderTimetableMgr(container, title); break;
        case 'attendance_report': renderAttendanceReport(container, title); break;
        // Staff Pages
        case 'mark_attendance': renderStaffAttendance(container, title); break;
        case 'enter_marks': renderStaffMarks(container, title); break;
        case 'staff_timetable': renderMyTimetable(container, title); break;
        // Student Pages
        case 'student_marks': renderStudentMarks(container, title); break;
        case 'student_attendance': renderStudentAttendance(container, title); break;
        case 'student_timetable': renderStudentTimetable(container, title); break;
    }
}

/**
 * GENERATION HELPERS
 */
function generateAutoId(prefix, count) {
    return `${prefix}${String(count + 1).padStart(4, '0')}`;
}

function generatePassword() {
    return Math.random().toString(36).slice(-8);
}

/**
 * PAGE RENDERERS
 */

function renderOverview(container, title) {
    title.innerText = "College Overview";
    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                <p class="text-sm text-gray-500 uppercase">Total Students</p>
                <h4 class="text-3xl font-bold">${COLLECTIONS.students.length}</h4>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <p class="text-sm text-gray-500 uppercase">Faculty Staff</p>
                <h4 class="text-3xl font-bold">${COLLECTIONS.staff.length}</h4>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                <p class="text-sm text-gray-500 uppercase">Departments</p>
                <h4 class="text-3xl font-bold">${COLLECTIONS.departments.length}</h4>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                <p class="text-sm text-gray-500 uppercase">Subjects</p>
                <h4 class="text-3xl font-bold">${COLLECTIONS.departments.reduce((acc, d) => acc + d.subjects.length, 0)}</h4>
            </div>
        </div>
    `;
}

function renderManageStudents(container, title) {
    title.innerText = "Student Management";
    container.innerHTML = `
        <div class="mb-4 flex justify-between">
            <button onclick="openStudentModal()" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <i class="fas fa-plus mr-2"></i> Add Student
            </button>
            <input type="text" placeholder="Search student..." onkeyup="filterTable('student-table', this.value)" class="border px-3 py-1 rounded">
        </div>
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <table class="w-full text-left" id="student-table">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="p-4 border-b">Roll No</th>
                        <th class="p-4 border-b">Name</th>
                        <th class="p-4 border-b">Degree/Dept</th>
                        <th class="p-4 border-b">Sem/Sec</th>
                        <th class="p-4 border-b">Email</th>
                        <th class="p-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${COLLECTIONS.students.map(s => `
                        <tr>
                            <td class="p-4 border-b">${s.rollNo}</td>
                            <td class="p-4 border-b">${s.name}</td>
                            <td class="p-4 border-b">${s.degree} / ${s.dept}</td>
                            <td class="p-4 border-b">S${s.semester} - ${s.section}</td>
                            <td class="p-4 border-b text-blue-600">${s.email}</td>
                            <td class="p-4 border-b">
                                <button onclick="editStudent('${s.rollNo}')" class="text-blue-500 mr-2 hover:text-blue-700"><i class="fas fa-edit"></i></button>
                                <button onclick="deleteStudent('${s.rollNo}')" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function editStudent(roll) { openStudentModal(roll); }
function deleteStudent(roll) {
    const idx = COLLECTIONS.students.findIndex(s => s.rollNo === roll);
    if (idx > -1) {
        COLLECTIONS.students.splice(idx, 1);
        COLLECTIONS.users = COLLECTIONS.users.filter(u => u.id !== roll);
        saveData();
        navigateTo('students');
        showToast("Student deleted");
    }
}

function openStudentModal(rollNo = null) {
    const s = rollNo ? COLLECTIONS.students.find(x => x.rollNo === rollNo) : null;
    document.getElementById('modal-title').innerText = s ? "Edit Student" : "Add New Student";
    document.getElementById('modal-content').innerHTML = `
        <form id="student-form" class="space-y-4">
            <input type="hidden" name="oldRollNo" value="${s ? s.rollNo : ''}">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm">Full Name</label>
                    <input type="text" name="name" value="${s ? s.name : ''}" required class="w-full border px-3 py-2 rounded">
                </div>
                <div>
                    <label class="block text-sm">Degree</label>
                    <select name="degree" class="w-full border px-3 py-2 rounded">
                        <option ${s?.degree === 'B.Tech' ? 'selected' : ''}>B.Tech</option>
                        <option ${s?.degree === 'M.Tech' ? 'selected' : ''}>M.Tech</option>
                        <option ${s?.degree === 'B.Sc' ? 'selected' : ''}>B.Sc</option>
                    </select>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm">Department</label>
                    <select name="dept" class="w-full border px-3 py-2 rounded">
                        ${COLLECTIONS.departments.map(d => `<option value="${d.id}" ${s?.dept === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm">Semester</label>
                    <input type="number" name="semester" min="1" max="8" value="${s ? s.semester : 1}" class="w-full border px-3 py-2 rounded">
                </div>
                <div>
                    <label class="block text-sm">Section</label>
                    <input type="text" name="section" value="${s ? s.section : 'A'}" class="w-full border px-3 py-2 rounded">
                </div>
            </div>
            <div class="flex justify-end space-x-2 pt-4">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Save Student</button>
            </div>
        </form>
    `;

    document.getElementById('student-form').onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const roll = s ? s.rollNo : generateAutoId('STU', COLLECTIONS.students.length);
        const pass = s ? s.password : generatePassword();
        
        const newStudent = {
            rollNo: roll,
            name: formData.get('name'),
            degree: formData.get('degree'),
            dept: formData.get('dept'),
            semester: formData.get('semester'),
            section: formData.get('section'),
            email: `${roll.toLowerCase()}@eduflow.edu`,
            password: pass,
            role: 'student'
        };

        if (s) {
            const idx = COLLECTIONS.students.findIndex(x => x.rollNo === s.rollNo);
            COLLECTIONS.students[idx] = newStudent;
            const uIdx = COLLECTIONS.users.findIndex(u => u.id === s.rollNo);
            if (uIdx > -1) COLLECTIONS.users[uIdx] = { id: roll, name: newStudent.name, role: 'student', password: pass, email: newStudent.email };
        } else {
            COLLECTIONS.students.push(newStudent);
            COLLECTIONS.users.push({ id: roll, name: newStudent.name, role: 'student', password: pass, email: newStudent.email });
        }
        
        saveData();
        closeModal();
        navigateTo('students');
        showToast(`Student ${s ? 'Updated' : 'Added'}. Creds: ${roll} / ${pass}`);
    };

    openModal();
}

/**
 * STAFF MANAGEMENT
 */
function renderManageStaff(container, title) {
    title.innerText = "Staff Management";
    container.innerHTML = `
        <div class="mb-4 flex justify-between">
            <button onclick="openStaffModal()" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <i class="fas fa-plus mr-2"></i> Add Staff
            </button>
        </div>
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <table class="w-full text-left">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="p-4 border-b">Staff ID</th>
                        <th class="p-4 border-b">Name</th>
                        <th class="p-4 border-b">Department</th>
                        <th class="p-4 border-b">Specialization</th>
                        <th class="p-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${COLLECTIONS.staff.map(st => `
                        <tr>
                            <td class="p-4 border-b">${st.staffNo}</td>
                            <td class="p-4 border-b">${st.name}</td>
                            <td class="p-4 border-b">${st.dept}</td>
                            <td class="p-4 border-b">${st.specialization}</td>
                            <td class="p-4 border-b">
                                <button onclick="editStaff('${st.staffNo}')" class="text-blue-500 mr-2 hover:text-blue-700"><i class="fas fa-edit"></i></button>
                                <button onclick="deleteStaff('${st.staffNo}')" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function editStaff(id) { openStaffModal(id); }
function deleteStaff(id) {
    const idx = COLLECTIONS.staff.findIndex(s => s.staffNo === id);
    if (idx > -1) {
        COLLECTIONS.staff.splice(idx, 1);
        COLLECTIONS.users = COLLECTIONS.users.filter(u => u.id !== id);
        saveData();
        navigateTo('staff');
        showToast("Staff deleted");
    }
}

function openStaffModal(staffNo = null) {
    const st = staffNo ? COLLECTIONS.staff.find(x => x.staffNo === staffNo) : null;
    document.getElementById('modal-title').innerText = st ? "Edit Staff" : "Add New Staff";
    document.getElementById('modal-content').innerHTML = `
        <form id="staff-form" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm">Full Name</label>
                    <input type="text" name="name" value="${st ? st.name : ''}" required class="w-full border px-3 py-2 rounded">
                </div>
                <div>
                    <label class="block text-sm">Department</label>
                    <select name="dept" class="w-full border px-3 py-2 rounded">
                        ${COLLECTIONS.departments.map(d => `<option value="${d.id}" ${st?.dept === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div>
                <label class="block text-sm">Specialization (Topic taught)</label>
                <input type="text" name="spec" value="${st ? st.specialization : ''}" placeholder="e.g. Data Structures" class="w-full border px-3 py-2 rounded">
            </div>
            <div class="flex justify-end space-x-2 pt-4">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Save Staff</button>
            </div>
        </form>
    `;

    document.getElementById('staff-form').onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const id = st ? st.staffNo : generateAutoId('FAC', COLLECTIONS.staff.length);
        const pass = st ? st.password : generatePassword();

        const staffObj = {
            staffNo: id,
            name: formData.get('name'),
            dept: formData.get('dept'),
            specialization: formData.get('spec'),
            email: `${id.toLowerCase()}@eduflow.edu`,
            password: pass,
            role: 'staff'
        };

        if (st) {
            const idx = COLLECTIONS.staff.findIndex(x => x.staffNo === id);
            COLLECTIONS.staff[idx] = staffObj;
            const uIdx = COLLECTIONS.users.findIndex(u => u.id === id);
            if (uIdx > -1) COLLECTIONS.users[uIdx] = { id: id, name: staffObj.name, role: 'staff', password: pass, email: staffObj.email };
        } else {
            COLLECTIONS.staff.push(staffObj);
            COLLECTIONS.users.push({ id: id, name: staffObj.name, role: 'staff', password: pass, email: staffObj.email });
        }

        saveData();
        closeModal();
        navigateTo('staff');
        showToast(`Staff account ${st ? 'Updated' : 'Created'}: ${id} / ${pass}`);
    };
    openModal();
}

/**
 * SUBJECTS & DEPARTMENTS
 */
function renderSubjects(container, title) {
    title.innerText = "Departments & Subjects";
    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <h4 class="font-bold mb-4 border-b pb-2">All Departments & Subjects</h4>
                <div class="space-y-4">
                    ${COLLECTIONS.departments.map(d => `
                        <div class="p-3 bg-gray-50 rounded">
                            <div class="flex justify-between items-center font-bold mb-2">
                                <span>${d.name} (${d.id})</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">${d.subjects.length} Subjects</span>
                            </div>
                            <ul class="text-sm space-y-1">
                                ${d.subjects.length > 0 ? d.subjects.map(s => `
                                    <li class="flex justify-between border-b border-gray-200 py-1">
                                        <span>${s.code} - ${s.name}</span>
                                        <span class="text-gray-400">Sem ${s.semester}</span>
                                    </li>
                                `).join('') : '<li class="text-gray-400 italic">No subjects added</li>'}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <h4 class="font-bold mb-4 border-b pb-2">Add Subject</h4>
                <form id="subject-form" class="space-y-4">
                    <div>
                        <label class="block text-sm">Department</label>
                        <select id="sub-dept" class="w-full border px-3 py-2 rounded">
                            ${COLLECTIONS.departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm">Subject Name</label>
                        <input type="text" id="sub-name" required class="w-full border px-3 py-2 rounded">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm">Semester</label>
                            <input type="number" id="sub-sem" min="1" max="8" value="1" class="w-full border px-3 py-2 rounded">
                        </div>
                        <div>
                            <label class="block text-sm">Subject Code</label>
                            <input type="text" id="sub-code" placeholder="CS101" class="w-full border px-3 py-2 rounded">
                        </div>
                    </div>
                    <button type="submit" class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Add Subject</button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('subject-form').onsubmit = (e) => {
        e.preventDefault();
        const deptId = document.getElementById('sub-dept').value;
        const name = document.getElementById('sub-name').value;
        const sem = document.getElementById('sub-sem').value;
        const code = document.getElementById('sub-code').value;

        const dept = COLLECTIONS.departments.find(d => d.id === deptId);
        dept.subjects.push({ code, name, semester: sem });
        saveData();
        renderSubjects(container, title);
        showToast("Subject Added Successfully");
    };
}

/**
 * TIMETABLE LOGIC
 */
function renderTimetableMgr(container, title) {
    title.innerText = "Timetable Management";
    container.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h4 class="font-bold mb-4">Auto-Generate Timetable</h4>
            <div class="grid grid-cols-4 gap-4 items-end">
                <div>
                    <label class="text-sm">Department</label>
                    <select id="tt-dept" class="w-full border px-3 py-2 rounded">
                        ${COLLECTIONS.departments.map(d => `<option value="${d.id}">${d.id}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="text-sm">Semester</label>
                    <input type="number" id="tt-sem" value="1" min="1" max="8" class="w-full border px-3 py-2 rounded">
                </div>
                <div>
                    <label class="text-sm">Section</label>
                    <input type="text" id="tt-sec" value="A" class="w-full border px-3 py-2 rounded">
                </div>
                <button onclick="generateTimetable()" class="bg-blue-600 text-white py-2 rounded">Generate</button>
            </div>
        </div>
        <div id="tt-view-area"></div>
    `;
}

function generateTimetable() {
    const deptId = document.getElementById('tt-dept').value;
    const sem = document.getElementById('tt-sem').value;
    const sec = document.getElementById('tt-sec').value;

    const dept = COLLECTIONS.departments.find(d => d.id === deptId);
    const subjects = dept.subjects.filter(s => s.semester == sem);
    const staffList = COLLECTIONS.staff.filter(s => s.dept === deptId);

    if (subjects.length === 0) {
        showToast("No subjects found for this semester", true);
        return;
    }

    // Simple randomization for timetable
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const periods = 6;
    const newTT = [];

    days.forEach(day => {
        for (let i = 1; i <= periods; i++) {
            const sub = subjects[Math.floor(Math.random() * subjects.length)];
            // Assign staff who specialized in this or just any staff from dept
            const assignedStaff = staffList.find(st => st.specialization.toLowerCase().includes(sub.name.toLowerCase())) || staffList[0] || { name: 'TBD', staffNo: 'NA' };
            
            newTT.push({
                dept: deptId, sem, sec, day, period: i,
                subject: sub.name, staff: assignedStaff.name, staffId: assignedStaff.staffNo
            });
        }
    });

    // Filter out old and add new
    COLLECTIONS.timetable = COLLECTIONS.timetable.filter(t => !(t.dept === deptId && t.sem == sem && t.sec === sec));
    COLLECTIONS.timetable.push(...newTT);
    saveData();
    displayTimetableGrid(deptId, sem, sec);
}

function displayTimetableGrid(dept, sem, sec) {
    const area = document.getElementById('tt-view-area');
    const data = COLLECTIONS.timetable.filter(t => t.dept === dept && t.sem == sem && t.sec === sec);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    area.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-sm overflow-x-auto">
            <h5 class="font-bold mb-4">Timetable: ${dept} - Sem ${sem} (${sec})</h5>
            <table class="w-full border-collapse">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="border p-2">Day</th>
                        <th class="border p-2">P1</th>
                        <th class="border p-2">P2</th>
                        <th class="border p-2">P3</th>
                        <th class="border p-2">P4</th>
                        <th class="border p-2">P5</th>
                        <th class="border p-2">P6</th>
                    </tr>
                </thead>
                <tbody>
                    ${days.map(day => {
                        const dayPeriods = data.filter(d => d.day === day).sort((a,b) => a.period - b.period);
                        return `
                            <tr>
                                <td class="border p-2 font-bold bg-gray-50">${day}</td>
                                ${dayPeriods.map(p => `
                                    <td class="border p-2 text-xs">
                                        <div class="font-bold">${p.subject}</div>
                                        <div class="text-gray-500">${p.staff}</div>
                                    </td>
                                `).join('')}
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * STAFF: ATTENDANCE & MARKS
 */
function renderStaffAttendance(container, title) {
    title.innerText = "Mark Attendance";
    const myClasses = [...new Set(COLLECTIONS.timetable.filter(t => t.staffId === currentUser.id).map(t => `${t.dept}-${t.sem}-${t.sec}`))];
    
    container.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="grid grid-cols-3 gap-4 mb-6">
                <div>
                    <label class="block text-sm">Select Class</label>
                    <select id="att-class" class="w-full border p-2 rounded">
                        ${myClasses.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm">Date</label>
                    <input type="date" id="att-date" value="${new Date().toISOString().split('T')[0]}" class="w-full border p-2 rounded">
                </div>
                <div class="flex items-end">
                    <button onclick="loadAttendanceSheet()" class="bg-blue-600 text-white px-6 py-2 rounded">Load Students</button>
                </div>
            </div>
            <div id="attendance-sheet"></div>
        </div>
    `;
}

function loadAttendanceSheet() {
    const classVal = document.getElementById('att-class').value;
    if(!classVal) return showToast("No classes assigned", true);
    
    const classInfo = classVal.split('-');
    const date = document.getElementById('att-date').value;
    const [dept, sem, sec] = classInfo;
    
    // Check freeze logic (7 days)
    const diffTime = Math.abs(new Date() - new Date(date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isFrozen = diffDays > 7;

    const students = COLLECTIONS.students.filter(s => s.dept === dept && s.semester == sem && s.section === sec);
    const sheet = document.getElementById('attendance-sheet');

    sheet.innerHTML = "";
    if (isFrozen) {
        sheet.innerHTML = `<div class="p-4 bg-orange-50 text-orange-700 rounded border border-orange-200 mb-4">
            <i class="fas fa-lock mr-2"></i> This attendance sheet is frozen. You cannot modify records older than 7 days.
        </div>`;
    }

    sheet.innerHTML += `
        <table class="w-full">
            <thead>
                <tr class="text-left border-b">
                    <th class="py-2">Roll No</th>
                    <th class="py-2">Name</th>
                    <th class="py-2">Status</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(s => {
                    const existing = COLLECTIONS.attendance.find(a => a.rollNo === s.rollNo && a.date === date);
                    const status = existing ? existing.status : 'Present';
                    return `
                        <tr class="border-b">
                            <td class="py-3">${s.rollNo}</td>
                            <td class="py-3">${s.name}</td>
                            <td class="py-3">
                                <select ${isFrozen ? 'disabled' : ''} onchange="updateAttendance('${s.rollNo}', '${date}', this.value)" class="border rounded px-2 py-1">
                                    <option value="Present" ${status === 'Present' ? 'selected' : ''}>Present</option>
                                    <option value="Absent" ${status === 'Absent' ? 'selected' : ''}>Absent</option>
                                </select>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function updateAttendance(rollNo, date, status) {
    const idx = COLLECTIONS.attendance.findIndex(a => a.rollNo === rollNo && a.date === date);
    if (idx > -1) {
        COLLECTIONS.attendance[idx].status = status;
    } else {
        const s = COLLECTIONS.students.find(s => s.rollNo === rollNo);
        COLLECTIONS.attendance.push({ rollNo, date, status, semester: s.semester });
    }
    saveData();
    showToast("Saved Status");
}

/**
 * STUDENT VIEW: MARKS & ATTENDANCE
 */
function renderStudentMarks(container, title) {
    title.innerText = "My Academic Records";
    const student = COLLECTIONS.students.find(s => s.rollNo === currentUser.id);
    const myMarks = COLLECTIONS.marks.filter(m => m.rollNo === currentUser.id);

    container.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="flex justify-between items-center mb-6">
                <h4 class="font-bold">Marksheet - Semester ${student.semester}</h4>
            </div>
            <table class="w-full">
                <thead>
                    <tr class="text-left border-b bg-gray-50">
                        <th class="p-3">Subject</th>
                        <th class="p-3">Marks</th>
                        <th class="p-3">Grade</th>
                    </tr>
                </thead>
                <tbody>
                    ${myMarks.filter(m => m.semester == student.semester).map(m => `
                        <tr class="border-b">
                            <td class="p-3">${m.subject}</td>
                            <td class="p-3 font-semibold">${m.score}/100</td>
                            <td class="p-3"><span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">PASS</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderStudentAttendance(container, title) {
    title.innerText = "My Attendance Report";
    const records = COLLECTIONS.attendance.filter(a => a.rollNo === currentUser.id);
    const total = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-xl shadow-sm text-center">
                <p class="text-gray-500 text-sm">Overall Attendance</p>
                <h3 class="text-4xl font-bold ${percentage < 75 ? 'text-red-500' : 'text-green-500'}">${percentage}%</h3>
            </div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm">
            <h4 class="font-bold mb-4">Detailed Daily Log</h4>
            <table class="w-full">
                <thead>
                    <tr class="text-left bg-gray-50">
                        <th class="p-3">Date</th>
                        <th class="p-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${records.sort((a,b) => new Date(b.date) - new Date(a.date)).map(r => `
                        <tr class="border-b">
                            <td class="p-3">${r.date}</td>
                            <td class="p-3 font-medium ${r.status === 'Present' ? 'text-green-600' : 'text-red-600'}">${r.status}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * MODAL CONTROLS
 */
function openModal() { document.getElementById('app-modal').style.display = 'flex'; }
function closeModal() { document.getElementById('app-modal').style.display = 'none'; }

function openChangePassword() {
    document.getElementById('modal-title').innerText = "Security - Change Password";
    document.getElementById('modal-content').innerHTML = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm">New Password</label>
                <input type="password" id="new-pass" class="w-full border px-3 py-2 rounded">
            </div>
            <button onclick="updatePassword()" class="w-full bg-blue-600 text-white py-2 rounded">Update Password</button>
        </div>
    `;
    openModal();
}

function updatePassword() {
    const pass = document.getElementById('new-pass').value;
    if (pass.length < 4) return showToast("Password too short", true);
    
    const uIdx = COLLECTIONS.users.findIndex(u => u.id === currentUser.id);
    COLLECTIONS.users[uIdx].password = pass;
    saveData();
    closeModal();
    showToast("Password updated successfully");
}

function filterTable(tableId, query) {
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++) {
        const text = rows[i].textContent.toLowerCase();
        rows[i].style.display = text.includes(query.toLowerCase()) ? '' : 'none';
    }
}

// Stub functions for missing pages
function renderAttendanceReport(container, title) {
    title.innerText = "Attendance Report";
    container.innerHTML = '<p class="text-gray-500">Attendance reporting feature coming soon.</p>';
}
function renderStaffMarks(container, title) {
    title.innerText = "Enter Marks";
    container.innerHTML = '<p class="text-gray-500">Marks entry feature coming soon.</p>';
}
function renderMyTimetable(container, title) {
    title.innerText = "My Timetable";
    container.innerHTML = '<p class="text-gray-500">Staff timetable view coming soon.</p>';
}
function renderStudentTimetable(container, title) {
    title.innerText = "My Timetable";
    container.innerHTML = '<p class="text-gray-500">Student timetable view coming soon.</p>';
}

// Initialize App
window.onload = () => {
    document.getElementById('auth-view').classList.remove('hidden');
};
