/**
 * 사단법인 행복한공감 공식 홈페이지
 * micos.or.kr 참조 인터랙션 & 애니메이션 스크립트
 */

let currentHeroSlide = 0;
let heroTimer = null;
let currentBlogCard = 0;
let blogTimer = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Reveal Animation (IntersectionObserver + fallback for fast jumps)
    const revealEls = document.querySelectorAll('.reveal_section');
    function revealInOrAboveViewport() {
        const triggerBottom = window.innerHeight * 0.96;
        revealEls.forEach((el) => {
            if (!el.classList.contains('revealed')) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= triggerBottom) {
                    el.classList.add('revealed');
                }
            }
        });
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.05 }
        );
        revealEls.forEach((el) => observer.observe(el));
        window.addEventListener('scroll', revealInOrAboveViewport, { passive: true });
        revealInOrAboveViewport();
    } else {
        revealEls.forEach((el) => el.classList.add('revealed'));
    }

    // 2. Floating #quick Position (keeps clear of sticky header and stops cleanly above footer)
    const quickMenu = document.getElementById('quick');
    function updateQuickPosition() {
        if (!quickMenu) return;
        if (window.innerWidth < 1250) {
            quickMenu.style.top = '';
            return;
        }
        const defaultTop = 145;
        const footer = document.getElementById('footer');
        if (!footer) {
            quickMenu.style.top = `${defaultTop}px`;
            return;
        }
        const footerTopInViewport = footer.getBoundingClientRect().top;
        const quickH = quickMenu.offsetHeight;
        const maxBottom = defaultTop + quickH + 24;
        if (footerTopInViewport < maxBottom) {
            const liftedTop = Math.max(118, footerTopInViewport - quickH - 24);
            quickMenu.style.top = `${liftedTop}px`;
        } else {
            quickMenu.style.top = `${defaultTop}px`;
        }
    }

    window.addEventListener('scroll', updateQuickPosition, { passive: true });
    window.addEventListener('resize', updateQuickPosition);
    updateQuickPosition();

    // 3. Hero Carousel Auto-Play & Pause on Hover
    const heroSlider = document.getElementById('heroSlider');
    startHeroAuto();
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', stopHeroAuto);
        heroSlider.addEventListener('mouseleave', startHeroAuto);
    }

    // 4. Recent News Card Auto-Slider
    startBlogAuto();

    // 5. Mobile Drawer Toggle
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    if (mobileBtn && mobileDrawer) {
        mobileBtn.addEventListener('click', () => {
            mobileDrawer.classList.toggle('open');
        });
    }

    // 6. Close modals / search on backdrop or Escape
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            e.target.classList.remove('active');
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-backdrop.active').forEach((m) => m.classList.remove('active'));
            toggleHeaderSearch(false);
            closeMobileDrawer();
        }
    });
});

// Reveal helper when jumping straight via menu/shortcut
function revealSectionById(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('revealed');
    }
}

// ========================================================
// HERO SLIDER
// ========================================================
function setHeroSlide(index) {
    const slides = document.querySelectorAll('.hero_slide');
    const dots = document.querySelectorAll('.hero_dot');
    if (!slides.length) return;

    currentHeroSlide = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === currentHeroSlide));
    dots.forEach((d, i) => d.classList.toggle('active', i === currentHeroSlide));
}

function moveHeroSlide(delta) {
    setHeroSlide(currentHeroSlide + delta);
}

function startHeroAuto() {
    stopHeroAuto();
    heroTimer = setInterval(() => moveHeroSlide(1), 6000);
}

function stopHeroAuto() {
    if (heroTimer) {
        clearInterval(heroTimer);
        heroTimer = null;
    }
}

// ========================================================
// HEADER SEARCH & MOBILE DRAWER
// ========================================================
function toggleHeaderSearch(forceState) {
    const bar = document.getElementById('headerSearchBar');
    const btn = document.getElementById('tSrchBtn');
    const input = document.getElementById('headerSearchInput');
    if (!bar) return;

    const shouldOpen = typeof forceState === 'boolean' ? forceState : !bar.classList.contains('open');
    bar.classList.toggle('open', shouldOpen);
    bar.setAttribute('aria-hidden', String(!shouldOpen));
    if (btn) btn.classList.toggle('active', shouldOpen);

    if (shouldOpen && input) {
        input.value = '';
        filterHeaderSearch();
        setTimeout(() => input.focus(), 120);
    }
}

function filterHeaderSearch() {
    const input = document.getElementById('headerSearchInput');
    const list = document.getElementById('headerSearchResults');
    if (!input || !list) return;

    const q = input.value.trim().toLowerCase();
    list.querySelectorAll('li').forEach((item) => {
        item.style.display = item.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
}

function toggleMobileAcc(btn) {
    const panel = btn.nextElementSibling;
    if (panel) panel.classList.toggle('open');
}

function closeMobileDrawer() {
    const mobileDrawer = document.getElementById('mobileDrawer');
    if (mobileDrawer) mobileDrawer.classList.remove('open');
}

// ========================================================
// HOME NEWS TABS & RECENT BLOG SLIDER
// ========================================================
function filterHomeNews(category, btnEl) {
    document.querySelectorAll('.news_tab').forEach((t) => t.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    document.querySelectorAll('#homeNewsList .micos_news_item').forEach((item) => {
        const match = category === 'all' || item.dataset.cat === category;
        item.style.display = match ? 'flex' : 'none';
    });
}

function moveBlogCard(delta) {
    const track = document.getElementById('recentTrack');
    if (!track) return;
    const total = track.children.length;
    if (!total) return;

    currentBlogCard = (currentBlogCard + delta + total) % total;
    track.style.transform = `translateX(-${currentBlogCard * 100}%)`;
}

function startBlogAuto() {
    if (blogTimer) clearInterval(blogTimer);
    blogTimer = setInterval(() => moveBlogCard(1), 5000);
}

// ========================================================
// SECTION TABS & NAVIGATION SHORTCUTS
// ========================================================
function switchAboutTab(tabKey) {
    document.querySelectorAll('.about-tab-btn').forEach((btn) => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`aboutTab-${tabKey}`);
    if (activeBtn) activeBtn.classList.add('active');

    document.querySelectorAll('.about-pane').forEach((pane) => pane.classList.remove('active'));
    const activePane = document.getElementById(`pane-${tabKey}`);
    if (activePane) activePane.classList.add('active');

    revealSectionById('about');
    scrollToElement('about');
}

const BUSINESS_KEYS = ['center', 'leading', 'education', 'fieldwork'];

function switchBusinessTab(tabKey) {
    document.querySelectorAll('.biz-tab-btn').forEach((btn) => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`bizTab-${tabKey}`);
    if (activeBtn) activeBtn.classList.add('active');

    document.querySelectorAll('.biz-photo-card').forEach((card) => card.classList.remove('active'));
    const activeMini = document.getElementById(`bizMini-${tabKey}`);
    if (activeMini) activeMini.classList.add('active');

    document.querySelectorAll('.biz-pane').forEach((pane) => pane.classList.remove('active'));
    const activePane = document.getElementById(`bizPane-${tabKey}`);
    if (activePane) activePane.classList.add('active');
}

function stepBusinessTab(delta) {
    const activePane = document.querySelector('.biz-pane.active');
    const curId = activePane ? activePane.id.replace('bizPane-', '') : 'center';
    const idx = Math.max(0, BUSINESS_KEYS.indexOf(curId));
    const nextKey = BUSINESS_KEYS[(idx + delta + BUSINESS_KEYS.length) % BUSINESS_KEYS.length];
    switchBusinessTab(nextKey);
}

function goToBusinessSub(tabKey) {
    switchBusinessTab(tabKey);
    revealSectionById('business');
    scrollToElement('business');

    const spotlight = document.querySelector(`#bizPane-${tabKey} .biz-spotlight-card`);
    if (spotlight) {
        spotlight.classList.remove('spotlight-pulse');
        void spotlight.offsetWidth;
        spotlight.classList.add('spotlight-pulse');
        setTimeout(() => spotlight.classList.remove('spotlight-pulse'), 1600);
    }
}

function switchSupportTab(tabKey) {
    document.querySelectorAll('.support-tab-btn').forEach((btn) => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`supportTab-${tabKey}`);
    if (activeBtn) activeBtn.classList.add('active');

    document.querySelectorAll('.support-pane').forEach((pane) => pane.classList.remove('active'));
    const activePane = document.getElementById(`supportPane-${tabKey}`);
    if (activePane) activePane.classList.add('active');
}

function goToSupportSub(tabKey) {
    switchSupportTab(tabKey);
    revealSectionById('support');
    scrollToElement('support');
}

function switchBoardTab(tabName) {
    const tabs = {
        notice: { btn: 'tabNoticeBtn', content: 'boardNoticeContent' },
        press: { btn: 'tabPressBtn', content: 'boardPressContent' },
        archive: { btn: 'tabArchiveBtn', content: 'boardArchiveContent' },
    };

    Object.values(tabs).forEach(({ btn, content }) => {
        const b = document.getElementById(btn);
        const c = document.getElementById(content);
        if (b) b.classList.remove('active');
        if (c) c.classList.remove('active');
    });

    const target = tabs[tabName];
    if (target) {
        const b = document.getElementById(target.btn);
        const c = document.getElementById(target.content);
        if (b) b.classList.add('active');
        if (c) c.classList.add('active');
    }
}

function goToBoardSub(tabName) {
    switchBoardTab(tabName);
    revealSectionById('board');
    scrollToElement('board');
}

// ========================================================
// MODALS, COPY, SCROLL & FORMS
// ========================================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function openNoticeModal(title, content, date) {
    const modal = document.getElementById('noticeDetailModal');
    if (modal) {
        document.getElementById('modalNoticeTitle').textContent = title;
        document.getElementById('modalNoticeContent').textContent = content;
        document.getElementById('modalNoticeDate').textContent = date;
        modal.classList.add('active');
    }
}

function copyAccount(accountNumber) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
            .writeText(accountNumber)
            .then(() => showToast(`계좌번호 [${accountNumber}]가 복사되었습니다.`))
            .catch(() => fallbackCopy(accountNumber));
    } else {
        fallbackCopy(accountNumber);
    }
}

function fallbackCopy(accountNumber) {
    const tempInput = document.createElement('input');
    tempInput.value = accountNumber;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(`계좌번호 [${accountNumber}]가 복사되었습니다.`);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2800);
    }
}

function scrollToElement(id) {
    const el = document.getElementById(id);
    if (!el) return;

    // Ensure all sections above target are revealed before calculating offset
    document.querySelectorAll('.reveal_section').forEach((sec) => {
        if (sec === el || sec.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) {
            sec.classList.add('revealed');
        }
    });

    requestAnimationFrame(() => {
        const headerEl = document.getElementById('header');
        const headerH = headerEl ? headerEl.offsetHeight : (window.innerWidth >= 1250 ? 108 : 80);
        const targetY = Math.max(0, window.scrollY + el.getBoundingClientRect().top - headerH + 2);
        window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
}

function handleFormSubmit(e, formName) {
    e.preventDefault();
    showToast(`[${formName}] 신청 내용이 입력되었습니다. 빠른 상담·문의는 052-248-1366으로 연락해 주세요.`);
    e.target.reset();
}
