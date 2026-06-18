<?php
// Lấy link sản phẩm gốc từ trình duyệt gửi lên
$url_san_pham = isset($_GET['url']) ? $_GET['url'] : '';

if (empty($url_san_pham)) {
    die("Vui lòng nhập link sản phẩm Shopee!");
}

// 🔥 ĐIỀN CHÍNH XÁC ID AFFILIATE CỦA ANH VÀO ĐÂY ĐỂ ĐỔ HOA HỒNG VỀ TÚI ANH
$my_affiliate_id = "17322830423"; 

// Bọc link sản phẩm sạch vào cổng an_redir và gắn tag mạng xã hội "product----"
$link_chuyen_huong_shopee = "https://s.shopee.vn/an_redir?origin_link=" . urlencode($url_san_pham) . "&affiliate_id=" . $my_affiliate_id . "&sub_id=product----";

// Thả xích cho trình duyệt tự nhảy sang Shopee kích hoạt mã
header("Location: " . $link_chuyen_huong_shopee);
exit;
?>
