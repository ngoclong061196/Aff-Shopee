export default function handler(req, res) {
    let url_san_pham = req.query.url || '';
    const my_affiliate_id = req.query.aff_id || "17322830423"; 

    if (!url_san_pham) {
        return res.status(400).send("Vui lòng nhập link sản phẩm Shopee!");
    }

    // Làm sạch link sản phẩm
    if (url_san_pham.includes('?')) {
        url_san_pham = url_san_pham.split('?')[0];
    }

    // Tạo link cổng chuyển hướng Affiliate trực tiếp của Shopee
    const link_chuyen_huong_shopee = `https://s.shopee.vn/an_redir?origin_link=${encodeURIComponent(url_san_pham)}&affiliate_id=${my_affiliate_id}&sub_id=product----`;

    // Sử dụng mã phản hồi 302 để chuyển hướng ngay lập tức trên Server, không hiển thị trang chờ
    res.writeHead(302, { 'Location': link_chuyen_huong_shopee });
    return res.end();
}
