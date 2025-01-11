// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBEwJV5H0IYih8F_qFqkqMxqjIz7saVYbQ",
    authDomain: "employee-management-syst-c0932.firebaseapp.com",
    projectId: "employee-management-syst-c0932",
    storageBucket: "employee-management-syst-c0932.appspot.com",
    messagingSenderId: "295693046740",
    appId: "1:295693046740:web:900c8f9189627b3ff6c20f"
};

// Initialize Firebase with offline persistence
try {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    
    // Enable offline persistence
    db.enablePersistence()
        .catch((err) => {
            if (err.code == 'failed-precondition') {
                console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
            } else if (err.code == 'unimplemented') {
                console.warn('The current browser does not support offline persistence');
            }
        });

    // Add network status listener
    firebase.firestore().enableNetwork().catch(console.error);
    
    let isOnline = true;
    db.collection('employees').onSnapshot(() => {
        isOnline = true;
        console.log('Connected to Firestore');
    }, (error) => {
        isOnline = false;
        console.warn('Disconnected from Firestore:', error);
    });

    const PATHS = {
        LOGIN: '../../pages/login/login.html'
    };

    class DashboardManager {
        static async init() {
            if (!this.checkAuth()) return;
            await this.loadDashboard();
        }

        static checkAuth() {
            return localStorage.getItem('user') !== null;
        }

        static async loadDashboard() {
            try {
                await Promise.all([
                    this.updateDashboardStats(),
                    this.loadRecentEmployees()
                ]);
            } catch (error) {
                console.error('Dashboard Error:', error.message);
            }
        }

        static async updateDashboardStats() {
            try {
                const employeesRef = db.collection('employees');
                const snapshot = await employeesRef.get({ source: isOnline ? 'server' : 'cache' });
                
                if (snapshot.metadata.fromCache) {
                    console.log('Data came from cache');
                }

                // Calculate total employees
                const totalEmployees = snapshot.size;
                document.getElementById('totalEmployees').textContent = totalEmployees;

                // Calculate unique departments
                const departments = new Set();
                let totalSalary = 0;

                snapshot.forEach(doc => {
                    const employee = doc.data();
                    departments.add(employee.department);
                    totalSalary += parseFloat(employee.salary) || 0;
                });

                document.getElementById('totalDepartments').textContent = departments.size;
                
                // Calculate average salary
                const averageSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;
                document.getElementById('averageSalary').textContent = `$${averageSalary.toFixed(2)}`;

            } catch (error) {
                console.error('Error fetching stats:', error);
                const stats = document.querySelectorAll('#totalEmployees, #totalDepartments, #averageSalary');
                stats.forEach(stat => stat.textContent = '0');
            }
        }

        static async loadRecentEmployees() {
            try {
                const employeesRef = db.collection('employees');
                const snapshot = await employeesRef
                    .orderBy('startDate', 'desc')
                    .limit(5)
                    .get({ source: isOnline ? 'server' : 'cache' });

                const employeesList = document.getElementById('employeesList');
                
                if (snapshot.empty) {
                    employeesList.innerHTML = '<tr><td colspan="4" class="text-center">No employees found</td></tr>';
                    return;
                }

                employeesList.innerHTML = '';
                snapshot.forEach(doc => {
                    const employee = doc.data();
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${employee.firstName} ${employee.lastName}</td>
                        <td>${employee.position}</td>
                        <td>${employee.department}</td>
                        <td>${new Date(employee.startDate).toLocaleDateString()}</td>
                    `;
                    employeesList.appendChild(row);
                });

            } catch (error) {
                console.error('Error loading employees:', error);
                document.getElementById('employeesList').innerHTML = 
                    '<tr><td colspan="4" class="text-center">Unable to load employees. You may be offline.</td></tr>';
            }
        }

        static handleLogout() {
            localStorage.removeItem('user');
            window.location.href = PATHS.LOGIN;
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        DashboardManager.init();
        
        // Add logout button event listener
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', DashboardManager.handleLogout);
        }
    });

    window.handleLogout = DashboardManager.handleLogout;

    document.addEventListener('DOMContentLoaded', function() {
        const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
        const sidebar = document.getElementById('sidebar');

        sidebarCollapseBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            
            // Toggle the chevron icon direction
            const icon = this.querySelector('i');
            if (sidebar.classList.contains('collapsed')) {
                icon.classList.replace('bi-chevron-left', 'bi-chevron-right');
            } else {
                icon.classList.replace('bi-chevron-right', 'bi-chevron-left');
            }
        });
    });

} catch (error) {
    console.error('Firebase initialization error:', error);
    alert('Error connecting to the database. Please check your internet connection.');
}
