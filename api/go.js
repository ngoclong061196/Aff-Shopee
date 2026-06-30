export default function handler(req, res) {
    let url_san_pham = req.query.url || '';
    const aff_type = req.query.aff_type || 'pure';

    if (!url_san_pham) {
        return res.status(400).send("Vui lòng nhập link sản phẩm Shopee!");
    }

    if (url_san_pham.includes('?')) {
        url_san_pham = url_san_pham.split('?')[0];
    }

    // 🔥 ID AFFILIATE CỦA ANH
    const my_affiliate_id = "17322830423"; 

    // Link cổng redir chính thức của Shopee
    const link_chuyen_huong_shopee = `https://s.shopee.vn/an_redir?origin_link=${encodeURIComponent(url_san_pham)}&affiliate_id=${my_affiliate_id}&sub_id=product----`;

    if (aff_type !== 'instagram') {
        res.writeHead(302, { Location: link_chuyen_huong_shopee });
        return res.end();
    }

    // 🔥 LUỒNG TỐI ƯU: Trả về trang đệm tạo Click giả lập ngay trên thiết bị khách
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Đang xử lý mã giảm giá...</title>
            <script type="text/shopee-short-url-checked">1</script>
            <meta name="shopee:version" content="sw-WEBFE-MKP-2026.06.v2-1-1">
            <meta name="referrer" content="no-referrer">
        </head>
        <body>
            <div style="text-align: center; margin-top: 50px; font-family: sans-serif; color: #666;">
                <h3>Đang tự động áp mã giảm giá độc quyền và mở App Shopee...</h3>
                <p>Vui lòng chờ trong giây lát.</p>
            </div>

            <script>
                // Tạo một thẻ chuyển hướng ẩn
                var anchor = document.createElement('a');
                anchor.href = "${link_chuyen_huong_shopee}";
                
                // Giả lập thuộc tính để lừa trình duyệt đây là cú click trực tiếp từ ứng dụng nền (Direct/In-App)
                anchor.rel = "noreferrer";
                
                document.body.appendChild(anchor);
                
                // Kích hoạt cú click ngầm trong 0.01 giây
                setTimeout(function() {
                    anchor.click();
                }, 10);
            </script>
        </body>
        </html>
    `);
}
