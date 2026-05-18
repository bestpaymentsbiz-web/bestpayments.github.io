document.addEventListener("DOMContentLoaded", function() {
    checkPopupStatus('popup-1');
    checkPopupStatus('popup-2');
    updateWrapperDisplay();
});

function closePopup(id) {
    const popup = document.getElementById(id);
    const isHideToday = popup.querySelector('.hide-today').checked;

    if (isHideToday) {
        // 24시간 동안 유지되는 만료 시간 설정
        const expiryDate = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem(id, expiryDate);
    }
    
    popup.remove(); // 화면에서 제거
    updateWrapperDisplay();
}

function checkPopupStatus(id) {
    const expiry = localStorage.getItem(id);
    const now = new Date().getTime();
    const popup = document.getElementById(id);

    if (popup && expiry && now < expiry) {
        popup.remove();
    }
}

// 남아있는 팝업이 없으면 검은 배경(wrapper) 자체를 숨김
function updateWrapperDisplay() {
    const container = document.getElementById('floating-popup-container');
    const remainingPopups = container.querySelectorAll('.popup-card');
    
    if (remainingPopups.length === 0) {
        container.style.display = 'none';
    }
}