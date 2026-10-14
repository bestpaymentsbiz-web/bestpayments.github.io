// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 헤더/푸터/플로팅 인라인 → fetch 불필요, 바로 초기화
    setupMobileMenu();
    initFloatingCounter();

    initializeTable();
    handleScrollAnimation();
    setupPartnerLogosScroll();
    setupPartnerLogosScroll();

    setupSmoothScroll();
    setupSmoothScroll2();

    // 모든 카카오 링크 카운트
    document.querySelectorAll('a[href*="han.gl"], a[href*="open.kakao"]').forEach(function(el) {
        el.addEventListener('click', gmIncrementCount);
    });
});


// 헤더 로드 함수
async function loadHeader() {
    try {
        const response = await fetch('header.html');
        const html = await response.text();
        document.getElementById('header-container').innerHTML = html;
        setupMobileMenu();
    } catch (error) {
        console.error('헤더 로드 중 오류 발생:', error);
    }
}

// 푸터 로드 함수
async function loadFooter() {
    try {
        const response = await fetch('footer.html');
        const html = await response.text();
        document.getElementById('footer-container').innerHTML = html;
    } catch (error) {
        console.error('푸터 로드 중 오류 발생:', error);
    }
}

// 플로팅 로드 함수
async function loadFloating() {
    try {
        const response = await fetch('floating.html');
        const html = await response.text();
        document.getElementById('floating-container').innerHTML = html;
        initFloatingCounter();
    } catch (error) {
        console.error('플로팅 로드 중 오류 발생:', error);
    }
}

// Firebase 설정
const GM_FIREBASE_URL = 'https://test-mod-775d6-default-rtdb.firebaseio.com';
const GM_TODAY = new Date(Date.now() + 9*60*60*1000).toISOString().slice(0,10);
const GM_CLICKED_KEY = 'gm_clicked_' + GM_TODAY;
const GM_CACHE_KEY = 'gm_count_cache';
const BASE_COUNT = 13;

// 자정 리셋: Firebase /date 확인, 날짜 바뀌면 /counter를 13으로 초기화
function gmCheckDailyReset(callback) {
    fetch(GM_FIREBASE_URL + '/date.json')
        .then(r => r.json())
        .then(savedDate => {
            if (savedDate !== GM_TODAY) {
                fetch(GM_FIREBASE_URL + '/counter.json', { method: 'PUT', body: JSON.stringify(BASE_COUNT) });
                fetch(GM_FIREBASE_URL + '/date.json', { method: 'PUT', body: JSON.stringify(GM_TODAY) });
                callback(BASE_COUNT);
            } else {
                fetch(GM_FIREBASE_URL + '/counter.json')
                    .then(r => r.json())
                    .then(val => {
                        const n = parseInt(val, 10);
                        callback(isNaN(n) ? BASE_COUNT : n);
                    })
                    .catch(() => callback(BASE_COUNT));
            }
        })
        .catch(() => callback(BASE_COUNT));
}

// 카카오 클릭 시 카운트 +1 (전역 공용 함수)
function gmIncrementCount() {
    if (localStorage.getItem(GM_CLICKED_KEY) === '1') return;
    fetch(GM_FIREBASE_URL + '/counter.json')
        .then(r => r.json())
        .then(val => {
            const cur = parseInt(val, 10);
            const newVal = (isNaN(cur) ? BASE_COUNT : cur) + 1;
            fetch(GM_FIREBASE_URL + '/counter.json', { method: 'PUT', body: JSON.stringify(newVal) });
            localStorage.setItem(GM_CLICKED_KEY, '1');
            localStorage.setItem(GM_CACHE_KEY, newVal);
            const countEl = document.getElementById('inquiryCount');
            if (countEl) countEl.textContent = newVal;
        })
        .catch(() => {});
}

// 플로팅 카운터 초기화 (Firebase 실시간 공유)
function initFloatingCounter() {
    const countEl = document.getElementById('inquiryCount');

    // 캐시된 값 즉시 표시 (깜빡임 방지) — 숫자가 아닌 캐시는 제거
    const cached = localStorage.getItem(GM_CACHE_KEY);
    const cachedNum = parseInt(cached, 10);
    if (isNaN(cachedNum)) {
        localStorage.removeItem(GM_CACHE_KEY); // [object Object] 등 오염된 캐시 제거
    } else if (countEl) {
        countEl.textContent = cachedNum;
    }

    // 페이지 로드 시 1회만 날짜 체크 + 리셋
    gmCheckDailyReset(function(val) {
        if (countEl) countEl.textContent = val;
        localStorage.setItem(GM_CACHE_KEY, val);
    });

    // 이후 10초마다 카운터만 읽기 (날짜 체크 없음)
    function fetchCount() {
        fetch(GM_FIREBASE_URL + '/counter.json')
            .then(r => r.json())
            .then(val => {
                const n = parseInt(val, 10);
                if (!isNaN(n) && n > 0) {
                    if (countEl) countEl.textContent = n;
                    localStorage.setItem(GM_CACHE_KEY, n);
                }
            })
            .catch(() => {});
    }
    fetchCount();
    setInterval(fetchCount, 10000); // 10초마다 갱신

    // 플로팅 카카오 버튼
    const kakaoBtn = document.getElementById('kakaoFloatBtn');
    if (kakaoBtn) {
        kakaoBtn.addEventListener('click', gmIncrementCount);
    }

    // 페이지 내 모든 카카오 링크 (han.gl / open.kakao)
    document.querySelectorAll('a[href*="han.gl"], a[href*="open.kakao"]').forEach(function(el) {
        if (el.id === 'kakaoFloatBtn') return;
        el.addEventListener('click', gmIncrementCount);
    });


    const bubble = document.getElementById('floatingBubble');
    if (bubble) {
        setInterval(function () {
            bubble.classList.add('bubble-hide');
            setTimeout(function () { bubble.classList.remove('bubble-hide'); }, 800);
        }, 5000);
    }
}

// 모바일 메뉴 설정 함수
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const closeBtn = document.querySelector('.close-btn');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        closeBtn.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });

        const menuItems = document.querySelectorAll('.nav-list a');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
}

// 부드러운 스크롤 함수
function setupSmoothScroll() {
    // bottom-btn은 이제 product.html 링크로 사용 — smoothScroll 불필요
}

function setupSmoothScroll2() {
    const bottomBtn = document.querySelector('.request-button-link.kakao');
    const mainIntroduce = document.querySelector('.request-kakao');

    if (bottomBtn && mainIntroduce) {
        bottomBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const headerHeight = 70; // 헤더 높이
            
            // scroll-margin-top 설정
            mainIntroduce.style.scrollMarginTop = `${headerHeight}px`;
            
            // 스크롤 실행
            mainIntroduce.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
}

// 실시간 테이블 데이터
const tableData = [
    { name: '심**', amount: '850,000원', duration: '08분' },
    { name: '김**', amount: '100,000원', duration: '05분' },
    { name: '이**', amount: '1,200,000원', duration: '07분' },
    { name: '진**', amount: '300,000원', duration: '05분' },
    { name: '권**', amount: '280,000원', duration: '06분' },
    { name: '민**', amount: '500,000원', duration: '10분' },
    { name: '은**', amount: '150,000원', duration: '08분' },
    { name: '현**', amount: '80,000원', duration: '09분' },
    { name: '박**', amount: '400,000원', duration: '07분' },
    { name: '최**', amount: '200,000원', duration: '06분' },
    { name: '정**', amount: '600,000원', duration: '05분' },
    { name: '강**', amount: '50,000원', duration: '04분' }
];

// 최근 N분 전 날짜+시간 반환
function recentTime(minutesAgo) {
    const d = new Date(Date.now() - minutesAgo * 60000);
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return mo + '/' + day + ' ' + h + ':' + m;
}

// 테이블 행 생성 함수
function createTableRow(data, timeStr) {
    const t = timeStr || recentTime(Math.floor(Math.random() * 15) + 1);
    return `
        <tr>
            <td>${data.name}</td>
            <td>${data.amount}</td>
            <td>${t}</td>
            <td>${data.duration}</td>
            <td><span class="status-button">입금완료</span></td>
        </tr>
    `;
}

// 테이블 초기화 및 롤링 설정
function initializeTable() {
    const tableBody = document.getElementById('liveTableBody');
    if (!tableBody) return;

    // 초기 테이블 데이터 생성 (각 행에 최근 시간 배정)
    tableBody.innerHTML = tableData.map((data, i) => createTableRow(data, recentTime(i * 2 + 1))).join('');

    let isAnimating = false;
    const animationDuration = 1000; // 1초
    const pauseDuration = 2000; // 2초 대기

    function animateTable() {
        if (isAnimating) return;
        isAnimating = true;

        // 새로운 행 생성
        const randomData = tableData[Math.floor(Math.random() * tableData.length)];
        const newRow = document.createElement('tr');
        newRow.innerHTML = createTableRow(randomData);
        newRow.style.opacity = '0';
        tableBody.appendChild(newRow);

        // 모든 행의 위치를 위로 한 칸씩 이동
        const rows = tableBody.getElementsByTagName('tr');
        const rowHeight = rows[0].offsetHeight;

        // 애니메이션 시작
        tableBody.style.transition = `transform ${animationDuration}ms ease-in-out`;
        tableBody.style.transform = `translateY(-${rowHeight}px)`;

        // 애니메이션 완료 후
        setTimeout(() => {
            tableBody.style.transition = 'none';
            tableBody.style.transform = 'translateY(0)';
            rows[0].remove(); // 첫 번째 행 제거
            newRow.style.opacity = '1';
            isAnimating = false;

            // 다음 애니메이션을 위한 대기
            setTimeout(animateTable, pauseDuration);
        }, animationDuration);
    }

    // 초기 딜레이 후 애니메이션 시작
    setTimeout(animateTable, pauseDuration);
}

// 스크롤 애니메이션
function handleScrollAnimation() {
    const fadeElements = document.querySelectorAll('.fade-up');
    const slideElements = document.querySelectorAll('.slide-in-left');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                if (entry.boundingClientRect.top > 0) {
                    entry.target.classList.remove('active');
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px'
    });

    fadeElements.forEach(element => {
        observer.observe(element);
        if (element.getBoundingClientRect().top < window.innerHeight * 1.1) {
            element.classList.add('active');
        }
    });

    slideElements.forEach(element => {
        observer.observe(element);
        if (element.getBoundingClientRect().top < window.innerHeight * 1.1) {
            element.classList.add('active');
        }
    });
}


// 모바일 환경에서 파트너 로고 자동 스크롤
function setupPartnerLogosScroll() {
    const partnersWrapper = document.querySelector('.partners-logo-wrapper');
    if (!partnersWrapper) return;
    
    // 모바일 환경에서만 동작
    if (window.innerWidth <= 768) {
        let scrollPosition = 0;
        const scrollSpeed = 1; // 스크롤 속도 (픽셀/프레임)
        const scrollInterval = 30; // 스크롤 간격 (밀리초)
        const scrollStep = 1; // 한 번에 스크롤할 픽셀 수
        
        // 자동 스크롤 함수
        function autoScroll() {
            scrollPosition += scrollStep;
            
            // 스크롤이 끝에 도달하면 처음으로 돌아감
            if (scrollPosition >= partnersWrapper.scrollWidth - partnersWrapper.clientWidth) {
                scrollPosition = 0;
            }
            
            partnersWrapper.scrollLeft = scrollPosition;
        }
        
        // 자동 스크롤 시작
        const scrollTimer = setInterval(autoScroll, scrollInterval);
        
        // 마우스 오버 시 스크롤 일시 중지
        partnersWrapper.addEventListener('mouseenter', () => {
            clearInterval(scrollTimer);
        });
        
        // 마우스 아웃 시 스크롤 재개
        partnersWrapper.addEventListener('mouseleave', () => {
            setInterval(autoScroll, scrollInterval);
        });
        
        // 터치 이벤트 처리
        let touchStartX = 0;
        let touchStartScrollLeft = 0;
        
        partnersWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartScrollLeft = partnersWrapper.scrollLeft;
            clearInterval(scrollTimer);
        });
        
        partnersWrapper.addEventListener('touchend', () => {
            setInterval(autoScroll, scrollInterval);
        });
    }
}

// FAQ 아코디언
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // 클릭된 항목의 상태만 토글합니다
            item.classList.toggle('active');
        });
    });
}); 

// 구글 시트 폼 제출 처리
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded 이벤트 발생');
    
    const loanForm = document.getElementById('loanForm');
    const formStatus = document.getElementById('formStatus');
    
    console.log('폼 요소:', loanForm);
    
    if (loanForm) {
        console.log('폼 이벤트 리스너 등록');

        // 연락처: 숫자만 입력, 000-0000-0000 형식으로 자동 하이픈
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                const digits = this.value.replace(/\D/g, '').slice(0, 11);
                if (digits.length <= 3) {
                    this.value = digits;
                } else if (digits.length <= 7) {
                    this.value = digits.slice(0, 3) + '-' + digits.slice(3);
                } else {
                    this.value = digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7);
                }
            });
        }

        loanForm.addEventListener('submit', function(e) {
            console.log('폼 제출 이벤트 발생');
            
            // 기본 제출 동작 방지
            e.preventDefault();
            
            // 폼 상태 업데이트
            formStatus.style.display = 'block';
            formStatus.querySelector('.loading').style.display = 'block';
            formStatus.querySelector('.error').style.display = 'none';
            formStatus.querySelector('.success').style.display = 'none';
            
            // 폼 데이터 수집
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const product = document.getElementById('product').value;
            const privacy = document.getElementById('privacy').checked ? '동의' : '미동의';

            // 구글 스크립트 URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzf4nkZtmCPfySelsENdpWMW4kc1wEqmMcm2YA938vLwhOnc5JPDeKJs_nzYvUjuZmS/exec';

            // 전송 데이터 생성 (개인정보가 URL에 남지 않도록 본문으로 전송)
            const params = new URLSearchParams();
            params.append('name', name);
            params.append('phone', phone);
            params.append('product', product);
            params.append('privacy', privacy);

            // 폼 데이터 전송
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                body: params
            })
            .then(() => {
                console.log('요청 성공');
                
                // 성공 메시지 표시
                formStatus.querySelector('.loading').style.display = 'none';
                formStatus.querySelector('.success').style.display = 'block';
                
                // 3초 후 폼 상태 숨기기
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 3000);
                
                // 폼 초기화
                loanForm.reset();
                
                // 성공 알림
                alert('상담신청이 완료되었습니다.\n담당 상담사가 빠른 시일내에 연락드리겠습니다');
            })
            .catch(error => {
                console.error('요청 오류:', error);
                
                // 오류 메시지 표시
                formStatus.querySelector('.loading').style.display = 'none';
                formStatus.querySelector('.error').style.display = 'block';
                
                // 오류 알림
                alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
            });
            
            return false;
        });
    } else {
        console.error('폼 요소를 찾을 수 없습니다.');
    }
});

// 팝업 외부 클릭시 닫기
var privacyPopupEl = document.getElementById('privacyPopup');
if (privacyPopupEl) {
    privacyPopupEl.addEventListener('click', function(e) {
        if (e.target === this) {
            closePrivacyPopup();
        }
    });
}

function openPrivacyPopup() {
    document.getElementById('privacyPopup').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePrivacyPopup() {
    document.getElementById('privacyPopup').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function agreePrivacyPolicy() {
    document.getElementById('privacy').checked = true;
    closePrivacyPopup();
}

