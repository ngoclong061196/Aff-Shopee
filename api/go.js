export default function handler(req, res) {
    let url_san_pham = req.query.url || '';
    
    // Nếu không có link sản phẩm, báo lỗi luôn
    if (!url_san_pham) {
        return res.status(400).send("Vui lòng nhập link sản phẩm Shopee!");
    }

    // Làm sạch link sản phẩm (Bỏ các tham số rác đằng sau dấu ?)
    if (url_san_pham.includes('?')) {
        url_san_pham = url_san_pham.split('?')[0];
    }

    // 🔥 ID AFFILIATE VIP CỦA ANH (ĐÃ ĐƯỢC WHITELIST INSTAGRAM)
    const my_affiliate_id = "17322830423"; 

    // Ráp thành link cổng an_redir chuẩn của Shopee y hệt ảnh F12 của ông Hùng
    const link_chuyen_huong_shopee = `https://s.shopee.vn/an_redir?origin_link=${encodeURIComponent(url_san_pham)}&affiliate_id=${my_affiliate_id}&sub_id=product----`;

    // 🔥 MẸO CHỐT HẠ: Trả về phản hồi 302 thuần túy từ Server, không kèm HTML, không kèm JS
    // Trình duyệt sẽ nhận lệnh và văng sang Shopee với header sạch, kích hoạt Shopee tự sinh token
    res.writeHead(302, {
        'Location': link_chuyen_huong_shopee,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    
    return res.end();
}
