export default function handler(req, res) {
    let url_san_pham = req.query.url || '';
    const aff_type = req.query.aff_type || 'pure';

    if (!url_san_pham) {
        return res.status(400).send("Vui lòng nhập link sản phẩm Shopee!");
    }

    // Làm sạch link sản phẩm
    if (url_san_pham.includes('?')) {
        url_san_pham = url_san_pham.split('?')[0];
    }

    // 🔥 ID AFFILIATE CỦA ANH
    const my_affiliate_id = "17322830423"; 

    // Cấu trúc link cổng redir của Shopee mà anh bắt được bằng F12
    const link_chuyen_huong_shopee = `https://s.shopee.vn/an_redir?origin_link=${encodeURIComponent(url_san_pham)}&affiliate_id=${my_affiliate_id}&sub_id=product----`;

    // Nếu khách chọn link thường (pure), cho nhảy thẳng không cần giả lập
    if (aff_type !== 'instagram') {
        res.writeHead(302, { Location: link_chuyen_huong_shopee });
        return res.end();
    }

    // 🔥 NẾU LÀ LINK INSTAGRAM: Bọc qua cổng chuyển hướng của Instagram để tạo Referer xịn
    // Khi chạy qua đây, Shopee sẽ quét thấy Referer từ Instagram và TỰ GẮN TOKEN cho anh
    const link_boc_qua_instagram = `https://l.instagram.com/?u=${encodeURIComponent(link_chuyen_huong_shopee)}`;

    // Trả về lệnh chuyển hướng 302 gọi qua trạm Instagram
    res.writeHead(302, { Location: link_boc_qua_instagram });
    return res.end();
}
