// go.js - Script xử lý tự động nhận diện và giả lập click ảo lách Instagram
document.addEventListener("DOMContentLoaded", function () {
    // 1. Đọc thông số link hệ thống gửi sang
    const urlParams = new URLSearchParams(window.location.search);
    const redirUrl = urlParams.get('redir');
    const subId = urlParams.get('sub_id') || "instagram----";
    const affiliateId = "17322830423"; // ID Affiliate chuẩn ra tiền của anh

    if (redirUrl) {
        // 2. Xây dựng link Shopee đích danh
        const shopeeFinalLink = `https://s.shopee.vn/an_redir?origin_link=${encodeURIComponent(redirUrl)}&affiliate_id=${affiliateId}&sub_id=${subId}`;
        
        // 3. Kiểm tra xem có phải khách đang bấm từ app Facebook / Instagram không
        var ua = navigator.userAgent || navigator.vendor || window.opera;
        var isInApp = (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf("Instagram") > -1);

        if (isInApp) {
            // NẾU Ở TRONG APP: Thực hiện hành vi kích nổ click ảo sau 300ms để buộc máy nhảy sang app Shopee
            setTimeout(function () {
                var fakeClickBtn = document.createElement("a");
                fakeClickBtn.href = shopeeFinalLink;
                fakeClickBtn.target = "_blank";
                fakeClickBtn.rel = "noopener noreferrer";
                
                var clickEvent = new MouseEvent("click", {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                fakeClickBtn.dispatchEvent(clickEvent);
                
                // Dự phòng nếu lệnh click ảo bị trình duyệt chặn, tự động redirect cứng luôn
                setTimeout(function() {
                    window.location.href = shopeeFinalLink;
                }, 100);
            }, 300);
        } else {
            // NẾU Ở TRÌNH DUYỆT NGOÀI: Nhảy thẳng app Shopee không cần chờ đợi
            window.location.href = shopeeFinalLink;
        }
    }
});
