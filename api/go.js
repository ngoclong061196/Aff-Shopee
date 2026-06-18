export default function handler(req, res) {
    // 1. Nhận link sản phẩm sạch và loại chiến dịch từ giao diện gửi lên
    let url_san_pham = req.query.url || '';
    const aff_type = req.query.aff_type || 'pure';

    if (!url_san_pham) {
        return res.status(400).send("Vui lòng nhập link sản phẩm Shopee!");
    }

    // Tự động làm sạch link sản phẩm một lần nữa nếu còn sót dấu hỏi rác
    if (url_san_pham.includes('?')) {
        url_san_pham = url_san_pham.split('?')[0];
    }

    // 🔥 ĐIỀN CHÍNH XÁC ID AFFILIATE CỦA ANH VÀO ĐÂY ĐỂ NHẬN HOA HỒNG
    const my_affiliate_id = "17322830423"; 

    // 2. Cấu hình chính xác các tham số kích hoạt mã của từng tab
    let token_strings = "";

    if (aff_type === 'facebook') {
        // Cấu trúc chuỗi kích hoạt ví ẩn và token dành riêng cho Facebook
        token_strings = "&credential_token=TOKEN_MÃ_FB_SĂN_ĐƯỢC_Ở_ĐÂY&uls_trackid=TRACKID_FB_Ở_ĐÂY";
    } 
    else if (aff_type === 'instagram') {
        // Găm chặt chính xác cặp Token và TrackID sống nguyên bản của Instagram
        token_strings = "&credential_token=8wEwiDL7Z2Us4W7ZvDpoeD6hrmpQqii6GUTr2TpSgu&uls_trackid=55tob7ui00cq";
    }

    // 3. Tiến hành ráp nối bọc qua cổng an_redir của Shopee
    // Đảm bảo cụm mã token_strings được cộng trực tiếp vào tham số hệ thống
    const link_chuyen_huong_shopee = `https://s.shopee.vn/an_redir?origin_link=${encodeURIComponent(url_san_pham)}&affiliate_id=${my_affiliate_id}&sub_id=product----${token_strings}`;

    // 4. Ép trình duyệt thực hiện lệnh Redirect 302 chuyển hướng thẳng vào App Shopee
    res.redirect(302, link_chuyen_huong_shopee);
}
