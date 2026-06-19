export default function handler(req, res) {
    let url_san_pham = req.query.url || '';
    const my_affiliate_id = req.query.aff_id || "17322830423"; 

    if (!url_san_pham) {
        return res.status(400).send("Vui lòng nhập link sản phẩm Shopee!");
    }

    // Làm sạch link sản phẩm (Bỏ các tham số rác đằng sau dấu ?)
    if (url_san_pham.includes('?')) {
        url_san_pham = url_san_pham.split('?')[0];
    }

    // Ráp thành link cổng an_redir chuẩn của Shopee để tự gắn Token
    const link_chuyen_huong_shopee = `https://s.shopee.vn/an_redir?origin_link=${encodeURIComponent(url_san_pham)}&affiliate_id=${my_affiliate_id}&sub_id=product----`;

    // Trả về phản hồi 302 thuần túy từ Server để giữ sạch gói tin bảo mật của trình duyệt
    res.writeHead(302, {
        'Location': link_chuyen_huong_shopee,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    
    return res.end();
}
