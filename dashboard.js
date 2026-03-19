const SohojShebaDashboard = {

    currentUser: null,

    init() {
        this.checkAuth();
        this.setupNavigation();
        this.setupLogout();
    },

    // ─── Auth check ───────────────────────────────────
    checkAuth() {
        fetch('api/session.php')
            .then(r => r.json())
            .then(data => {
                if (!data.loggedIn) { window.location.href = 'login.html'; return; }
                this.currentUser = data.user;
                const isWorkerPage = document.body.classList.contains('worker-dashboard');
                if (isWorkerPage && data.user.role !== 'worker') { window.location.href = 'user-dashboard.html'; return; }
                if (!isWorkerPage && data.user.role === 'worker') { window.location.href = 'worker-dashboard.html'; return; }
                this.populateUserUI(data.user);
                if (isWorkerPage) this.loadWorkerContent();
                else this.loadUserContent();
                this.loadProfile();
            })
            .catch(() => { window.location.href = 'login.html'; });
    },

    // ─── Populate name / email from session ───────────
    populateUserUI(user) {
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('sidebarUserName',  user.name);
        set('sidebarUserEmail', user.email);
        set('profileName',      user.name);
    },

    // ─── Load full profile from API ───────────────────
    loadProfile() {
        fetch('api/profile.php')
            .then(r => r.json())
            .then(data => {
                if (!data.success) return;
                const p = data.profile;
                if (p.role === 'worker') this.populateWorkerProfile(p);
                else this.populateUserProfile(p);
            })
            .catch(() => {});
    },

    // ─── Helper: safely set element text ──────────────
    _set(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = (val !== null && val !== undefined && String(val).trim() !== '') ? val : '—';
    },

    _formatDate(str) {
        if (!str) return '—';
        try { return new Date(str).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }); }
        catch { return str; }
    },

    _cap(str) {
        if (!str) return '—';
        return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
    },

    _formatExp(val) {
        const map = { 'less-than-1':'Less than 1 year','1-2':'1–2 years','3-5':'3–5 years','5-10':'5–10 years','more-than-10':'More than 10 years' };
        return map[val] || val || '—';
    },

    // ─── USER profile ─────────────────────────────────
    populateUserProfile(p) {
        const s = this._set.bind(this);
        s('sidebarUserName',  p.name);
        s('sidebarUserEmail', p.email);
        s('profileName',      p.name);
        s('profileNameLarge', p.name);
        s('profileEmailSide', p.email);
        s('profileNameDetail', p.name);
        s('profileEmail',      p.email);
        s('profileJoinDate',   this._formatDate(p.member_since));
        s('profileDOB',        this._formatDate(p.date_of_birth));
        s('profileGender',     this._cap(p.gender));
        s('profilePhone',      p.phone);
        s('profileWhatsapp',   p.whatsapp);
        s('profileAltPhone',   p.alternative_phone);
        s('profileCountry',    this._cap(p.country));
        s('profileCity',       this._cap(p.city));
        s('profileArea',       p.area);
        s('profilePostal',     p.postal_code);
        s('profileAddress',    p.address);
        s('profileLanguage',   this._cap(p.preferred_language));
        s('profileReferral',   this._cap(p.referral_source));
        s('profilePreferences',p.preferences_text);
    },

    // ─── WORKER profile ───────────────────────────────
    populateWorkerProfile(p) {
        const s = this._set.bind(this);
        s('sidebarUserName',  p.name);
        s('sidebarUserEmail', p.email);
        s('profileName',      p.name);
        s('profileNameLarge', p.name);
        s('profileEmailSide', p.email);
        s('profileNameDetail', p.name);
        s('profileEmail',      p.email);
        s('profileJoinDate',   this._formatDate(p.member_since));
        s('profileDOB',        this._formatDate(p.date_of_birth));
        s('profileGender',     this._cap(p.gender));
        s('profilePhone',      p.phone);
        s('profileWhatsapp',   p.whatsapp);
        s('profileAltPhone',   p.alternative_phone);
        s('profileCountry',    this._cap(p.country));
        s('profileCity',       this._cap(p.city));
        s('profileArea',       p.area);
        s('profilePostal',     p.postal_code);
        s('profileAddress',    p.address);
        s('profileExperience', this._formatExp(p.experience));
        s('profileSkills',     p.skills);
        s('profileNID',        p.nid_number);
        s('profileLicense',    p.trade_license);
        s('profileJobs',       p.jobs_completed ?? '0');
        s('profileSpecialty',  (p.services && p.services.length > 0) ? p.services.join(', ') : '—');

        if (p.rating_avg && p.rating_avg > 0) {
            const rEl = document.querySelector('.big-rating');
            if (rEl) rEl.textContent = p.rating_avg.toFixed(1);
        }

        this._setProfilePhoto(p.profile_photo_path);
    },

    // ─── Profile photo: swap icon for real image ──────
    _setProfilePhoto(photoPath) {
        if (!photoPath || photoPath.trim() === '') return;

        // Large profile avatar in profile page
        const avaEl = document.querySelector('.profile-ava');
        if (avaEl) {
            avaEl.innerHTML = `<img src="${photoPath}" alt="Profile Photo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
            avaEl.style.padding = '0';
            avaEl.style.overflow = 'hidden';
        }

        // Small avatar in sidebar
        const sideAvaEl = document.querySelector('.sidebar .user-ava');
        if (sideAvaEl) {
            sideAvaEl.innerHTML = `<img src="${photoPath}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
            sideAvaEl.style.padding = '0';
            sideAvaEl.style.overflow = 'hidden';
        }

        // Topbar avatar
        const topAvaEl = document.querySelector('.topbar-avatar');
        if (topAvaEl) {
            topAvaEl.innerHTML = `<img src="${photoPath}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
            topAvaEl.style.padding = '0';
            topAvaEl.style.overflow = 'hidden';
        }
    },

    // ─── SPA navigation ───────────────────────────────
    setupNavigation() {
        document.querySelectorAll('.nav-item[data-page]').forEach(item => {
            item.addEventListener('click', () => {
                this.showPage(item.getAttribute('data-page'));
            });
        });
    },

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

        const target = document.getElementById(pageId + '-page');
        if (target) target.classList.add('active');

        const navItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
        if (navItem) navItem.classList.add('active');

        const titleEl = document.getElementById('pageTitle');
        if (titleEl) {
            const labels = {
                'overview':'Overview','bookings':'My Bookings','new-booking':'New Booking',
                'history':'History','favorites':'Favorites','profile':'Profile',
                'jobs':'Available Jobs','my-jobs':'My Jobs','completed':'Completed Jobs','earnings':'Earnings',
            };
            titleEl.textContent = labels[pageId] || pageId;
        }
    },

    // ─── User dashboard stats ─────────────────────────
    loadUserContent() {
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('statTotal','—'); set('statPending','—'); set('statCompleted','—'); set('statSpent','—');
    },

    // ─── Worker dashboard stats ───────────────────────
    loadWorkerContent() {
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('statAvailable','—'); set('statCompleted','—'); set('statEarnings','—');
        set('earnTotal','—'); set('earnMonth','—'); set('earnPending','—'); set('earnAvailable','—');
        set('profileSpecialty','—'); set('profileJobs','0');
    },

    // ─── Logout ───────────────────────────────────────
    setupLogout() {
        const doLogout = () => {
            fetch('api/logout.php', { method: 'POST' }).catch(() => {}).finally(() => { window.location.href = 'index.html'; });
        };
        document.getElementById('logoutBtn')?.addEventListener('click', doLogout);
        document.getElementById('profileLogout')?.addEventListener('click', doLogout);
    },

    quickBookService(serviceName) { this.showPage('new-booking'); }
};

document.addEventListener('DOMContentLoaded', () => SohojShebaDashboard.init());