// 갤러리 관련 모든 로직을 캡슐화하는 함수
function initializeGallery() {
    // ----------------------------------------------------------------------
    // --- 1. 필수 요소 정의 (Gallery & Modal) ---
    // ----------------------------------------------------------------------
    const gallery = document.getElementById('horizontalGallery');
    const scrollLeftBtn = document.getElementById('scrollLeftBtn');
    const scrollRightBtn = document.getElementById('scrollRightBtn');
    const scrollAmount = 350; // 한 번에 스크롤되는 너비

    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const modalCaption = document.getElementById("caption");
    const galleryLinks = document.querySelectorAll('.gallery-link');
    const closeBtn = document.getElementsByClassName("close-btn")[0];

    
    // ----------------------------------------------------------------------
    // --- 2. 모달(팝업) 기능 구현 ---
    // ----------------------------------------------------------------------
    if (modal) { 
        galleryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const fullImagePath = this.getAttribute('href');
                const captionElement = this.querySelector('.gallery-caption');
                const captionText = captionElement ? captionElement.textContent : '';
                modal.style.display = "block";
                modalImage.src = fullImagePath;
                modalCaption.textContent = captionText;
            });
        });

        closeBtn.onclick = function() { 
            modal.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }


    // ----------------------------------------------------------------------
    // --- 3. 수평 스크롤 버튼 기능 및 제어 구현 (에러 방지 로직 포함) ---
    // ----------------------------------------------------------------------
    if (gallery && scrollLeftBtn && scrollRightBtn) {
        
        // 왼쪽 스크롤
        scrollLeftBtn.addEventListener('click', () => {
            gallery.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
            // 스크롤 후 버튼 상태 즉시 체크 (부드러운 스크롤 완료 후 실행)
            setTimeout(checkScrollButtons, 350); 
        });

        // 오른쪽 스크롤
        scrollRightBtn.addEventListener('click', () => {
            gallery.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
            // 스크롤 후 버튼 상태 즉시 체크
            setTimeout(checkScrollButtons, 350); 
        });

        // 버튼 가시성 체크 함수
        function checkScrollButtons() {
            // 갤러리 내용이 컨테이너보다 작거나 같을 경우 (스크롤 불필요)
            if (gallery.scrollWidth <= gallery.clientWidth) {
                scrollLeftBtn.style.display = 'none';
                scrollRightBtn.style.display = 'none';
                return; 
            }

            // 스크롤이 필요할 경우 기본적으로 버튼 표시
            scrollLeftBtn.style.display = 'block';
            scrollRightBtn.style.display = 'block';

            // 왼쪽 끝에 도달하면 왼쪽 버튼 숨김
            if (gallery.scrollLeft === 0) {
                scrollLeftBtn.style.display = 'none';
            }
            
            // 오른쪽 끝에 도달하면 오른쪽 버튼 숨김 (스크롤 오차 허용)
            if (gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 1) {
                scrollRightBtn.style.display = 'none';
            }
        }
        
        // 갤러리가 스크롤될 때마다 버튼 상태 체크
        gallery.addEventListener('scroll', checkScrollButtons);

        // 페이지 로드 및 창 크기 변경 시 버튼 상태 체크 (초기화)
        checkScrollButtons();
        window.addEventListener('resize', checkScrollButtons);
    }
}

// DOM이 완전히 로드된 후 갤러리 초기화 함수 실행
document.addEventListener('DOMContentLoaded', initializeGallery);