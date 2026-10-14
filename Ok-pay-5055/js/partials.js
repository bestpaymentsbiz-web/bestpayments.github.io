/* ════════════════════════════════════════════════
   Ok-페이백 | partials.js
   6개 페이지에 공통으로 들어가는 헤더/티커/CS섹션/
   푸터/약관모달/플로팅버튼을 한 곳에서 관리합니다.
   전화번호·카카오톡 링크를 바꿀 땐 아래 두 상수만 고치면 됩니다.
   ════════════════════════════════════════════════ */

var Partials = (function () {
  var PHONE_TEL  = '010-5685-0152';
  var KAKAO_URL  = 'https://open.kakao.com/o/sjM2rXzi';

  var HEADER = '\
<header class="site-header">\
  <div class="header-inner">\
    <a href="index.html" class="logo-wrap">\
      <img src="assets/ok-payback-logo.png"\
           srcset="assets/ok-payback-logo@2x.png 2x"\
           alt="Ok-페이백 로고">\
    </a>\
    <button class="nav-toggle" onclick="toggleNav()" aria-label="메뉴 열기">☰</button>\
    <nav class="main-nav" id="mainNav">\
      <a href="index.html">신용카드한도이용 Ok-페이백</a>\
      <a href="card-cash.html">신용카드한도이용</a>\
      <a href="gift-card.html">상품권현금화</a>\
      <a href="mobile-pay.html">소액결제현금화</a>\
      <a href="faq.html">자주묻는질문</a>\
    </nav>\
  </div>\
</header>';

  var TICKER = '\
<div class="ticker" aria-hidden="true">\
  <div class="ticker-track">\
    <span>✅ 신용카드 한도이용</span>\
    <span>⚡ 신청 후 3분 즉시 입금</span>\
    <span>🔒 100% 안전 합법 거래</span>\
    <span>📞 24시간 365일 상담</span>\
    <span>💳 모든 카드사 이용 가능</span>\
    <span>🎁 상품권 현금화 최대 92%</span>\
    <span>📱 소액결제 현금화 최대 88%</span>\
    <span>✅ 신용카드 한도이용</span>\
    <span>⚡ 신청 후 3분 즉시 입금</span>\
    <span>🔒 100% 안전 합법 거래</span>\
    <span>📞 24시간 365일 상담</span>\
    <span>💳 모든 카드사 이용 가능</span>\
    <span>🎁 상품권 현금화 최대 92%</span>\
    <span>📱 소액결제 현금화 최대 88%</span>\
  </div>\
</div>';

  var CS = '\
<section class="cs-section" id="contact">\
  <div class="wrap">\
    <h2 class="cs-title">Ok-페이백 고객센터</h2>\
    <p class="cs-sub">365일 24시간 친절 상담 대기중</p>\
    <div class="cs-btns">\
      <a href="tel:' + PHONE_TEL + '" class="cs-btn-call"><span>📞</span> 전화상담</a>\
      <a href="' + KAKAO_URL + '" target="_blank" class="cs-btn-kakao"><span>💬</span> 카톡상담</a>\
    </div>\
  </div>\
</section>';

  var FOOTER = '\
<footer class="site-footer">\
  <div class="footer-inner">\
    <div class="footer-logo">\
      <img src="assets/ok-payback-logo.png"\
           srcset="assets/ok-payback-logo@2x.png 2x"\
           alt="Ok-페이백">\
      <p>정확하고 빠른 선금 서비스<br>24시간 운영</p>\
    </div>\
    <div class="footer-col">\
      <h4>서비스</h4>\
      <ul>\
        <li><a href="card-cash.html">신용카드 한도이용</a></li>\
        <li><a href="gift-card.html">상품권 현금화</a></li>\
        <li><a href="mobile-pay.html">소액결제 현금화</a></li>\
      </ul>\
    </div>\
    <div class="footer-col">\
      <h4>고객지원</h4>\
      <ul>\
        <li><a href="process.html">이용방법</a></li>\
        <li><a href="faq.html">자주묻는질문</a></li>\
        <li><a href="#contact">상담신청</a></li>\
      </ul>\
    </div>\
  </div>\
  <div class="footer-bottom">\
    <p>© 2025 Ok-페이백 All rights reserved. | 신용카드 전문 플랫폼</p>\
    <p>본 서비스는 합법적인 물품 거래를 기반으로 합니다. 불법 카드깡과 무관합니다.</p>\
    <div class="footer-legal">\
      <button type="button" onclick="openLegalModal(\'privacy\')">개인정보처리방침</button>\
      <span class="legal-divider">|</span>\
      <button type="button" onclick="openLegalModal(\'terms\')">이용약관</button>\
    </div>\
  </div>\
</footer>';

  var LEGAL_MODAL = '\
<div class="legal-modal-overlay" id="legalModalOverlay" onclick="if(event.target===this) closeLegalModal()">\
  <div class="legal-modal">\
    <div class="legal-modal-header">\
      <h3 id="legalModalTitle">개인정보처리방침</h3>\
      <button type="button" class="legal-modal-close" onclick="closeLegalModal()" aria-label="닫기">&times;</button>\
    </div>\
    <div class="legal-modal-body" id="legalModalBody"></div>\
  </div>\
</div>';

  var FLOAT = '\
<div class="float-wrap">\
  <a href="tel:' + PHONE_TEL + '" class="float-btn fb-call" title="전화상담">📞</a>\
  <a href="' + KAKAO_URL + '" target="_blank" class="float-btn fb-kakao" title="카카오톡">💬</a>\
</div>';

  function write(html) { document.write(html); }

  return {
    phone: PHONE_TEL,
    kakaoUrl: KAKAO_URL,
    header:       function () { write(HEADER); },
    ticker:       function () { write(TICKER); },
    cs:           function () { write(CS); },
    footer:       function () { write(FOOTER); },
    legalModal:   function () { write(LEGAL_MODAL); },
    floatButtons: function () { write(FLOAT); }
  };
})();
