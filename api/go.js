export default function handler(req, res) {
    let url_san_pham = req.query.url || '';
    const aff_type = req.query.aff_type || 'pure';

    if (!url_san_pham) {
        return res.status(400).send("Vui lòng nhập link sản phẩm Shopee!");
    }

    // Làm sạch link sản phẩm của khách nhập vào
    if (url_san_pham.includes('?')) {
        url_san_pham = url_san_pham.split('?')[0];
    }

    // 🔥 ID AFFILIATE VIP CỦA ANH (Đã được duyệt KOL)
    const my_affiliate_id = "17322830423"; 

    // Cấu trúc cổng chuyển hướng chuẩn của Shopee để tự gắn Token
    const link_chuyen_huong_shopee = `https://s.shopee.vn/an_redir?origin_link=${encodeURIComponent(url_san_pham)}&affiliate_id=${my_affiliate_id}&sub_id=product----`;

    // Nếu khách chọn luồng link thường, cho nhảy thẳng ăn hoa hồng thường
    if (aff_type !== 'instagram') {
        res.writeHead(302, { Location: link_chuyen_huong_shopee });
        return res.end();
    }

    // 🔥 LUỒNG XỬ LÝ INSTAGRAM: Trả về trang HTML đệm để ép trình duyệt tạo Referer Instagram thật
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Đang tự động áp mã giảm giá...</title>
            <script type="text/shopee-short-url-checked">1</script>
            <meta name="shopee:version" content="sw-WEBFE-MKP-2026.06.v2-1-1">
        </head>
        <body>
            <div style="text-align: center; margin-top: 50px; font-family: sans-serif; color: #666;">
                <h3>Đang tự động kích hoạt mã giảm giá Instagram và mở App Shopee...</h3>
                <p>Vui lòng chờ trong giây lát.</p>
            </div>

            <script>
                // Mẹo bắt trình duyệt phải ghi đè thuộc tính nguồn từ Instagram
                Object.defineProperty(document, 'referrer', {
                    get: function() { return 'https://l.instagram.com/'; }
                });

                // Tạo thẻ meta cho phép truyền toàn bộ URL nguồn đi để Shopee quét
                var meta = document.createElement('meta');
                meta.name = "referrer";
                meta.content = "unsafe-url";
                document.getElementsByTagName('head')[0].appendChild(meta);

                // Thực hiện cú nhảy quyết định sau 0.05 giây
                setTimeout(function() {
                    window.location.replace("${link_chuyen_huong_shopee}");
                }, 50);
            </script>
        </body>
        </html>
    `);
}
