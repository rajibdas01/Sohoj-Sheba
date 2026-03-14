<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Worker Dashboard – Shohoj Sheba</title>
    <link rel="stylesheet" href="dashboard.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body class="dashboard-body worker-dashboard">

<!-- Sidebar -->
<aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
        <div class="logo">
            <div class="logo-mark worker-mark"><i class="fa-solid fa-hard-hat"></i></div>
            <span>Shohoj <span class="logo-accent">Sheba</span></span>
        </div>
        <button id="sidebarToggle" class="sidebar-toggle">
            <i class="fa-solid fa-bars"></i>
        </button>
    </div>

    <nav class="sidebar-nav">
        <a href="#" class="nav-item active" data-page="overview">
            <i class="fa-solid fa-home"></i> Overview
        </a>
        <a href="#" class="nav-item" data-page="available">
            <i class="fa-solid fa-briefcase"></i> Available Jobs
        </a>
        <a href="#" class="nav-item" data-page="my-jobs">
            <i class="fa-solid fa-clipboard-list"></i> My Jobs
        </a>
        <a href="#" class="nav-item" data-page="completed">
            <i class="fa-solid fa-check-double"></i> Completed
        </a>
        <a href="#" class="nav-item" data-page="earnings">
            <i class="fa-solid fa-bangladeshi-taka-sign"></i> Earnings
        </a>
        <a href="#" class="nav-item" data-page="profile">
            <i class="fa-solid fa-user"></i> Profile
        </a>
    </nav>

    <div class="sidebar-footer">
        <button class="logout-btn" id="logoutBtn">
            <i class="fa-solid fa-right-from-bracket"></i> Logout
        </button>
    </div>
</aside>

<!-- Main Content -->
<main class="dashboard-main">
    <header class="top-bar">
        <button id="mobileMenuBtn" class="mobile-menu-btn">
            <i class="fa-solid fa-bars"></i>
        </button>
        <h1 class="page-title" id="pageTitle">Overview</h1>
        <div class="top-bar-actions">
            <button class="notification-btn">
                <i class="fa-solid fa-bell"></i>
                <span class="badge">0</span>
            </button>
        </div>
    </header>

    <div class="dashboard-content">

        <!-- Overview -->
        <section id="overview-page" class="content-section active">
            <div class="welcome-banner worker-banner">
                <h2>Welcome back, Worker!</h2>
                <p>Check new job opportunities and your recent work.</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon orange"><i class="fa-solid fa-briefcase"></i></div>
                    <div class="stat-content">
                        <strong>0</strong>
                        <span>Active Jobs</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange"><i class="fa-solid fa-bangladeshi-taka-sign"></i></div>
                    <div class="stat-content">
                        <strong>৳0</strong>
                        <span>This Month</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange"><i class="fa-solid fa-star"></i></div>
                    <div class="stat-content">
                        <strong>—</strong>
                        <span>Rating</span>
                    </div>
                </div>
            </div>

            <div class="section-card">
                <h3>Quick Actions</h3>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
                    <a href="#" class="btn primary" data-page="available">View Available Jobs</a>
                    <a href="#" class="btn outline" data-page="earnings">Check Earnings</a>
                </div>
            </div>
        </section>

        <!-- Available Jobs -->
        <section id="available-page" class="content-section">
            <div class="section-card">
                <h3>Available Jobs</h3>
                <div class="empty-state">
                    <i class="fa-solid fa-briefcase fa-3x muted"></i>
                    <h4>No new jobs right now</h4>
                    <p>New jobs will appear here when customers post them.</p>
                </div>
            </div>
        </section>

        <!-- My Jobs -->
        <section id="my-jobs-page" class="content-section">
            <div class="section-card">
                <h3>My Current Jobs</h3>
                <div class="empty-state">
                    <i class="fa-solid fa-list-check fa-3x muted"></i>
                    <h4>No active jobs</h4>
                    <p>Jobs you accepted will be shown here.</p>
                </div>
            </div>
        </section>

        <!-- Completed -->
        <section id="completed-page" class="content-section">
            <div class="section-card">
                <h3>Completed Jobs</h3>
                <div class="empty-state">
                    <i class="fa-solid fa-check-double fa-3x muted"></i>
                    <h4>No completed jobs yet</h4>
                    <p>Finished work will appear here with reviews.</p>
                </div>
            </div>
        </section>

        <!-- Earnings -->
        <section id="earnings-page" class="content-section">
            <div class="section-card">
                <h3>Earnings Overview</h3>
                <div class="empty-state">
                    <i class="fa-solid fa-wallet fa-3x muted"></i>
                    <h4>No earnings recorded yet</h4>
                    <p>Payments from completed jobs will appear here.</p>
                </div>
            </div>
        </section>

        <!-- Profile -->
        <section id="profile-page" class="content-section">
            <div class="section-card">
                <h3>Worker Profile</h3>
                <div class="profile-placeholder">
                    <div class="avatar-large orange">
                        <i class="fa-solid fa-hard-hat"></i>
                    </div>
                    <div>
                        <h4 id="workerName">Worker Name</h4>
                        <p id="workerEmail">worker@example.com</p>
                        <span class="badge">Worker</span>
                    </div>
                </div>

                <div style="margin-top: 2rem;">
                    <button class="btn outline"><i class="fa-solid fa-pen"></i> Edit Profile</button>
                    <button class="btn outline"><i class="fa-solid fa-key"></i> Change Password</button>
                </div>
            </div>
        </section>

    </div>
</main>

<script src="dashboard.js"></script>

</body>
</html>