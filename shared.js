// =================================================================
// == SHARED.JS - Central Logic and Data for PESO Application ==
// =================================================================

// --- 1. CONSTANTS ---
const USER_ROLES = { APPLICANT: 'applicant', EMPLOYER: 'employer', ADMIN: 'admin' };
const APPLICATION_STATUSES = { FOR_SCREENING: 'For Screening', WITHDRAWN: 'Withdrawn', NOT_QUALIFIED: 'Not Qualified (by PESO)', REFERRED: 'Referred to Employer', UNDER_REVIEW: 'Under Review', FOR_INITIAL_INTERVIEW: 'For Initial Interview', FOR_EXAM: 'For Exam', FOR_FINAL_INTERVIEW: 'For Final Interview', JOB_OFFER: 'Job Offer', HIRED: 'Hired', NOT_SELECTED: 'Not Selected (by Employer)' };

// --- 2. SESSION MANAGEMENT (with "Remember Me") ---
// NOTE: I'm assuming the functions are complete in your actual file.
function setLoggedInUser(user, remember = false) { 
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('loggedInUser', JSON.stringify(user));
}
function getLoggedInUser() {
    const user = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
}
function logoutUser() {
    localStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('loggedInUser');
    // Redirect to login page after logout
    window.location.href = 'index.html'; 
}

// --- 3. CORE DATA HELPERS ---
function getData(key) { return JSON.parse(localStorage.getItem(key)) || []; }
function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

// --- 4. DATA INITIALIZATION ---
function initializeMockData() {
    if (localStorage.getItem('users')) return;
    alert("No data found. Initializing with default mock data.");
    const mockData = {
        users: [
            // ==================================================
            // == ITO ANG IDINAGDAG NA ADMIN ACCOUNT           ==
            // ==================================================
            { 
                id: 99, 
                email: 'admin@peso.gov', 
                password: 'password', 
                role: 'admin', 
                profile: { 
                    name: 'PESO Administrator'
                } 
            },
            // ==================================================

            // Applicant Users
            { id: 1, email: 'juan.dela.cruz@email.com', password: 'password', role: 'applicant', profile: { 
                applicantId: 'PESO-2025-000001', name: 'Juan Dela Cruz', phone: '09123456789',
                gender: 'Male', is_pwd: false, pwd_type: '', is_senior: false,
                profile_picture_url: 'https://i.pravatar.cc/150?u=juan',
                skills: ['MS Office', 'Customer Service'], resume: { fileName: 'juan_resume.pdf' }, requirements: [{ name: 'NBI_Clearance.pdf' }] 
            } },
            { id: 2, email: 'maria.santos@email.com', password: 'password', role: 'applicant', profile: { 
                applicantId: 'PESO-2025-000002', name: 'Maria Santos', phone: '09987654321',
                gender: 'Female', is_pwd: true, pwd_type: 'Orthopedic', is_senior: false,
                profile_picture_url: 'https://i.pravatar.cc/150?u=maria',
                skills: ['Welding', 'Technical Drawing'], resume: null, requirements: [] 
            } },
            { id: 3, email: 'pedro.penduko@email.com', password: 'password', role: 'applicant', profile: { 
                applicantId: 'PESO-2025-000003', name: 'Pedro Penduko', phone: '09171112222',
                gender: 'Male', is_pwd: false, pwd_type: '', is_senior: true,
                profile_picture_url: 'https://i.pravatar.cc/150?u=pedro',
                skills: ['Gardening', 'Driving'], resume: null, requirements: [] 
            } },
            // ... (other mock data for jobs, applications, etc. should be here)
        ],
        jobs: [
            // Add mock job data here if needed
        ],
        applications: [
            // Add mock application data here if needed
        ],
        notifications: [
            // Add mock notification data here if needed
        ],
        settings: {
            lmiSubmissionOpen: false
        }
    };
    for (const key in mockData) saveData(key, mockData[key]);
}

// --- 5. UI HELPERS ---
function playNotificationSound() { /* ... (same as before) ... */ }
function displayNotification(placeholderId, message, type = 'info') { /* ... (same as before) ... */ }

function generateApplicantBadges(profile) {
    if (!profile) return '';
    let badgesHTML = '';
    if (profile.is_pwd) { badgesHTML += `<span class="badge bg-primary ms-2">PWD</span>`; }
    if (profile.is_senior) { badgesHTML += `<span class="badge bg-success ms-2">Senior Citizen</span>`; }
    return badgesHTML;
}

function showApplicantProfileModal(applicantId, modalInstance) {
    const applicant = getData('users').find(u => u.id === applicantId);
    if (!applicant) { alert('Applicant not found!'); return; }

    const p = applicant.profile;
    const modalBody = document.getElementById('applicantProfileBody');
    if (!modalBody) { console.error('Modal body with ID "applicantProfileBody" not found!'); return; }

    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-4 text-center">
                <img src="${p.profile_picture_url || 'https://via.placeholder.com/150'}" class="img-fluid rounded-circle mb-3" alt="Profile Picture" width="150" height="150">
                <h4>${p.name}</h4>
                <div>${generateApplicantBadges(p)}</div>
                <p class="text-muted small">${applicant.email}</p>
            </div>
            <div class="col-md-8">
                <h5><i class="fas fa-user-circle me-2"></i>Personal Details</h5>
                <table class="table table-sm table-borderless">
                    <tbody>
                        <tr><th style="width: 120px;">Gender:</th><td>${p.gender || 'N/A'}</td></tr>
                        <tr><th>Skills:</th><td>${(p.skills || []).join(', ') || 'N/A'}</td></tr>
                        ${p.is_pwd ? `<tr><th>Disability Type:</th><td>${p.pwd_type || 'Specified'}</td></tr>` : ''}
                    </tbody>
                </table>
                <hr>
                <h5><i class="fas fa-file-alt me-2"></i>Uploaded Requirements</h5>
                <ul class="list-group">
                    ${(p.requirements && p.requirements.length > 0) 
                        ? p.requirements.map(r => `<li class="list-group-item"><i class="fas fa-paperclip me-2"></i>${r.name}</li>`).join('')
                        : '<li class="list-group-item text-muted">No documents uploaded.</li>'
                    }
                </ul>
            </div>
        </div>
    `;
    
    modalInstance.show();
}


// --- 6. INITIALIZE ON LOAD ---
initializeMockData();