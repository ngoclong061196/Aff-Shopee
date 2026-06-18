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

    // 🔥 ID AFFILIATE CỦA ANH ĐỂ NHẬN HOA HỒNG
    const my_affiliate_id = "17322830423"; 

    // 2. Cấu hình chính xác các tham số kích hoạt mã của từng tab
    let token_strings = "";

    if (aff_type === 'facebook') {
        token_strings = "?utm_source=an_17322830423&mmp_pid=an_17322830423&utm_medium=affiliates&utm_campaign=-&utm_content=product----&credential_token=TOKEN_MÃ_FB_SĂN_ĐƯỢC_Ở_ĐÂY&uls_trackid=TRACKID_FB_Ở_ĐÂY";
    } 
    else if (aff_type === 'instagram') {
        // 🔥 MẤU CHỐT: Token phải đi liền sau dấu hỏi (?) của LINK SẢN PHẨM GỐC như thế này
        token_strings = "?utm_source=an_17322830423&mmp_pid=an_17322830423&utm_medium=affiliates&utm_campaign=-&utm_content=product----&credential_token=8wEwiDL7Z2Us4W7ZvDpoeD6hrmpQqii6GUTr2TpSgu&uls_trackid=55tob7ui00cq";
    }

    // 3. Tiến hành ráp nối bọc qua cổng an_redir của Shopee
    // Nếu là tab MXH, ta cộng chuỗi token vào ngay sau link sản phẩm rồi mới mã hóa (encodeURIComponent) toàn bộ
    let link_goc_co_token = url_san_pham;
    if (aff_type !== 'pure' && token_strings !== "") {
        link_goc_co_token = url_san_pham + token_strings;
    }

    // Đẩy toàn bộ cục link bọc kín này qua cổng an_redir
    const link_chuyen_huong_shopee = `https://s.shopee.vn/an_redir?origin_link=${encodeURIComponent(link_goc_co_token)}&affiliate_id=${my_affiliate_id}&sub_id=product----`;

    // 4. Ép trình duyệt thực hiện lệnh Redirect 302 chuyển hướng thẳng vào App Shopee
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.redirect(302, link_chuyen_huong_shopee);
}
