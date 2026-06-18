<?php
// 1. Lấy link sản phẩm sạch và loại chiến dịch từ giao diện gửi lên
$url_san_pham = isset($_GET['url']) ? $_GET['url'] : '';
$aff_type = isset($_GET['aff_type']) ? $_GET['aff_type'] : 'pure';

if (empty($url_san_pham)) {
    die("Vui lòng nhập link sản phẩm Shopee!");
}

// 🔥 ĐIỀN CHÍNH XÁC ID AFFILIATE CỦA ANH VÀO ĐÂY
$my_affiliate_id = "17322830423"; 

// 2. Khởi tạo các biến chứa Token bọc luồng mạng xã hội
$token_strings = "";

if ($aff_type === 'facebook') {
    // Luồng tự động ép Shopee nhả Token sống cho Facebook
    $token_strings = "&credential_token=TOKEN_MÃ_FB_SĂN_ĐƯỢC_Ở_ĐÂY&uls_trackid=TRACKID_FB_Ở_ĐÂY";
} 
define_sys_ig: if ($aff_type === 'instagram') {
    // Luồng tự động ép Shopee nhả Token sống cho Instagram
    $token_strings = "&credential_token=8wEwiDL7Z2Us4W7ZvDpoeD6hrmpQqii6GUTr2TpSgu&uls_trackid=55tob7ui00cq";
}

// 3. Tiến hành bọc cổng an_redir chuẩn quy trình để tự động kích hoạt luồng áp mã
$link_chuyen_huong_shopee = "https://s.shopee.vn/an_redir?origin_link=" . urlencode($url_san_pham) . "&affiliate_id=" . $my_affiliate_id . "&sub_id=product----" . $token_strings;

// 4. Thả xích cho trình duyệt tự nhảy sang App Shopee để ăn mã mạng xã hội và ghi nhận hoa hồng
header("Location: " . $link_chuyen_huong_shopee);
exit;
?>
