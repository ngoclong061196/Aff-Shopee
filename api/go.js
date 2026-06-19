export default function handler(req, res) {
    let url_san_pham = req.query.url || '';
    const my_affiliate_id = req.query.aff_id || "17322830423"; 
    const aff_type = req.query.aff_type || 'pure';

    if (!url_san_pham) {
        return res.status(400).send("Vui lòng nhập link sản phẩm Shopee!");
    }

    if (url_san_pham.includes('?')) {
        url_san_pham = url_san_pham.split('?')[0];
    }

    // Cổng an_redir tiếp nhận của Shopee
    const link_chuyen_huong_shopee = `https://s.shopee.vn/an_redir?origin_link=${encodeURIComponent(url_san_pham)}&affiliate_id=${my_affiliate_id}&sub_id=product----`;

    // Nếu là link Shopee thường, cho đi thẳng không cần đợi
    if (aff_type === 'pure') {
        res.writeHead(302, { 'Location': link_chuyen_huong_shopee });
        return res.end();
    }

    // Xác định nguồn Referer giả lập dựa trên tab khách chọn
    let fakeReferer = 'https://l.instagram.com/';
    let textLoading = 'Instagram';
    if (aff_type === 'facebook') {
        fakeReferer = 'https://l.facebook.com/';
        textLoading = 'Facebook';
    }

    // 🔥 TRẢ VỀ TRANG ĐỆM 1 GIÂY GIỐNG ÔNG HÙNG ĐỂ ÉP TRÌNH DUYỆT ĐỔI REFERER
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Đang xử lý mã giảm giá...</title>
            <meta name="referrer" content="unsafe-url">
            <style>
                body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: sans-serif; background-color: #f8f9fa; color: #555; }
                .loader { border: 4px solid #f3f3f3; border-top: 4px solid #ff5722; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
        </head>
        <body>
            <div class="loader"></div>
            <h3>Đang tự động áp mã giảm giá ${textLoading}...</h3>
            <p>Vui lòng chờ trong giây lát để hệ thống kích hoạt.</p>

            <script>
                // Ghi đè thuộc tính Referrer của trình duyệt ngay tại trang đệm
                Object.defineProperty(document, 'referrer', {
                    get: function() { return "${fakeReferer}"; }
                });

                // Chờ đúng 1 giây (1000ms) để trình duyệt ăn sâu cấu hình rồi mới văng sang Shopee
                setTimeout(function() {
                    window.location.replace("${link_chuyen_huong_shopee}");
                }, 1000);
            </script>
        </body>
        </html>
    `);
}
