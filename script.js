/**
 * 사단법인 행복한공감 & 서울산 성·가정상담소
 * Interactive Frontend Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mainNav');

    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            nav.classList.toggle('mobile-active');
        });

        // Close on link click in mobile
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                // If it's a dropdown toggle in mobile, handle toggle
                const parentDropdown = link.closest('.dropdown');
                if (window.innerWidth <= 768 && parentDropdown && link.classList.contains('nav-item')) {
                    if (!parentDropdown.classList.contains('open')) {
                        e.preventDefault();
                        parentDropdown.classList.toggle('open');
                        return;
                    }
                }

                if (window.innerWidth <= 768) {
                    nav.classList.remove('mobile-active');
                }
            });
        });
    }

    // 2. Close modals on backdrop click or Escape key
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            e.target.classList.remove('active');
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
});

// Board Tab Switcher (공지사항 / 보도자료)
function switchBoardTab(tabName) {
    const noticeBtn = document.getElementById('tabNoticeBtn');
    const pressBtn = document.getElementById('tabPressBtn');
    const noticeContent = document.getElementById('boardNoticeContent');
    const pressContent = document.getElementById('boardPressContent');

    if (tabName === 'notice') {
        noticeBtn.classList.add('active');
        pressBtn.classList.remove('active');
        noticeContent.classList.add('active');
        pressContent.classList.remove('active');
    } else {
        pressBtn.classList.add('active');
        noticeBtn.classList.remove('active');
        pressContent.classList.add('active');
        noticeContent.classList.remove('active');
    }
}

// About Section Tab Switcher
function switchAboutTab(tabKey) {
    // Update tab buttons
    const allButtons = document.querySelectorAll('.about-tab-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));

    const activeBtn = document.getElementById(`aboutTab-${tabKey}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Update tab panes
    const allPanes = document.querySelectorAll('.about-pane');
    allPanes.forEach(pane => pane.classList.remove('active'));

    const activePane = document.getElementById(`pane-${tabKey}`);
    if (activePane) {
        activePane.classList.add('active');
    }

    // Smooth scroll to About section if clicked from nav
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Modal open/close
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Open Notice Detail Modal
function openNoticeModal(title, content, date) {
    const modal = document.getElementById('noticeDetailModal');
    if (modal) {
        document.getElementById('modalNoticeTitle').textContent = title;
        document.getElementById('modalNoticeContent').textContent = content;
        document.getElementById('modalNoticeDate').textContent = date;
        modal.classList.add('active');
    }
}

// Copy Bank Account Number
function copyAccount(accountNumber) {
    navigator.clipboard.writeText(accountNumber).then(() => {
        showToast(`계좌번호 [${accountNumber}]가 복사되었습니다.`);
    }).catch(() => {
        // Fallback
        const tempInput = document.createElement('input');
        tempInput.value = accountNumber;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`계좌번호 [${accountNumber}]가 복사되었습니다.`);
    });
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2800);
    }
}

// Scroll to element helper
function scrollToElement(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
}

// Form Submission simulation
function handleFormSubmit(e, formName) {
    e.preventDefault();
    alert(`[${formName}] 접수가 정상적으로 완료되었습니다.\n작성해주신 연락처로 신속히 연락드리겠습니다. 감사합니다.`);
    
    // Close parent modal
    const modal = e.target.closest('.modal-backdrop');
    if (modal) {
        modal.classList.remove('active');
    }
    e.target.reset();
}
