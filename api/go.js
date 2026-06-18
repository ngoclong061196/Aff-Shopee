export default function handler(req, res) {
    // 1. Lấy link sản phẩm và loại chiến dịch từ link khách bấm
    const url_san_pham = req.query.url || '';
    const aff_type = req.query.aff_type || 'pure';

    if (!url_san_pham) {
        return res.status(400).send("Vui lòng nhập link sản phẩm Shopee!");
    }

    // 🔥 ĐIỀN CHÍNH XÁC ID AFFILIATE CỦA ANH VÀO ĐÂY
    const my_affiliate_id = "17322830423"; 

    // 2. Khởi tạo các biến chứa Token bọc luồng mạng xã hội
    let token_strings = "";

    if (aff_type === 'facebook') {
        token_strings = "&credential_token=TOKEN_MÃ_FB_SĂN_ĐƯỢC_Ở_ĐÂY&uls_trackid=TRACKID_FB_Ở_ĐÂY";
    } 
    else if (aff_type === 'instagram') {
        token_strings = "&credential_token=8wEwiDL7Z2Us4W7ZvDpoeD6hrmpQqii6GUTr2TpSgu&uls_trackid=55tob7ui00cq";
    }

    // 3. Tiến hành bọc cổng an_redir chuẩn quy trình
    const link_chuyen_huong_shopee = `https://s.shopee.vn/an_redir?origin_link=${encodeURIComponent(url_san_pham)}&affiliate_id=${my_affiliate_id}&sub_id=product----${token_strings}`;

    // 4. Lệnh chuyển hướng (Redirect 302) của Vercel bắt trình duyệt nhảy sang Shopee ăn mã
    res.redirect(302, link_chuyen_huong_shopee);
}
