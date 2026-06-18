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

    // Ráp link cổng chuyển hướng của Shopee
    const link_chuyen_huong_shopee = `https://s.shopee.vn/an_redir?origin_link=${encodeURIComponent(url_san_pham)}&affiliate_id=${my_affiliate_id}&sub_id=product----`;

    // Nếu là link thường, cho chuyển hướng thẳng
    if (aff_type !== 'instagram') {
        res.writeHead(302, { Location: link_chuyen_huong_shopee });
        return res.end();
    }

    // 🔥 NẾU LÀ LINK INSTAGRAM: Trả về trang HTML mồi để ÉP TRÌNH DUYỆT ghi đè Referer thành Instagram
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
                <h3>Đang tự động áp mã giảm giá độc quyền và mở App Shopee...</h3>
                <p>Vui lòng chờ trong giây lát.</p>
            </div>

            <script>
                // MẸO CỐT LÕI: Ép trình duyệt khi chuyển trang phải khai báo nguồn gốc từ Instagram
                Object.defineProperty(document, 'referrer', {
                    get: function() { return 'https://l.instagram.com/'; }
                });

                // Tạo một thẻ chuyển hướng ẩn dưới dạng click để giữ thuộc tính Referer giả lập
                var meta = document.createElement('meta');
                meta.name = "referrer";
                meta.content = "unsafe-url"; // Cho phép truyền toàn bộ URL referer đi
                document.getElementsByTagName('head')[0].appendChild(meta);

                setTimeout(function() {
                    // Bắn trình duyệt sang Shopee kèm theo Referer Instagram đã gài sẵn
                    window.location.replace("${link_chuyen_huong_shopee}");
                }, 50);
            </script>
        </body>
        </html>
    `);
}
