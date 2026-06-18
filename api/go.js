export default function handler(req, res) {
    let url_san_pham = req.query.url || '';
    const aff_type = req.query.aff_type || 'pure';

    if (!url_san_pham) {
        return res.status(400).send("Vui lòng nhập link sản phẩm Shopee!");
    }

    if (url_san_pham.includes('?')) {
        url_san_pham = url_san_pham.split('?')[0];
    }

    const my_affiliate_id = "17322830423"; 
    let token_strings = "";

    if (aff_type === 'facebook') {
        token_strings = "?utm_source=an_17322830423&mmp_pid=an_17322830423&utm_medium=affiliates&utm_campaign=-&utm_content=product----&credential_token=TOKEN_MÃ_FB_SĂN_ĐƯỢC_Ở_ĐÂY&uls_trackid=TRACKID_FB_Ở_ĐÂY";
    } 
    else if (aff_type === 'instagram') {
        token_strings = "?utm_source=an_17322830423&mmp_pid=an_17322830423&utm_medium=affiliates&utm_campaign=-&utm_content=product----&credential_token=8wEwiDL7Z2Us4W7ZvDpoeD6hrmpQqii6GUTr2TpSgu&uls_trackid=55tob7ui00cq";
    }

    let link_goc_co_token = url_san_pham;
    if (aff_type !== 'pure' && token_strings !== "") {
        link_goc_co_token = url_san_pham + token_strings;
    }

    const link_chuyen_huong_shopee = `https://s.shopee.vn/an_redir?origin_link=${encodeURIComponent(link_goc_co_token)}&affiliate_id=${my_affiliate_id}&sub_id=product----`;

    // 🔥 THAY ĐỔI QUAN TRỌNG: Trả về trang HTML mồi để đồng bộ hệ thống giống web họ
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Đang chuyển hướng đến Shopee...</title>
            <script type="text/shopee-short-url-checked">1</script>
            <meta name="shopee:version" content="sw-WEBFE-MKP-2026.06.v2-1-1">
            <script>
                // Chạy ngầm script đồng bộ trước khi mở App
                setTimeout(function() {
                    window.location.href = "${link_chuyen_huong_shopee}";
                }, 100);
            </script>
        </head>
        <body>
            <div style="text-align: center; margin-top: 50px; font-family: sans-serif; color: #666;">
                <h3>Đang tự động áp mã giảm giá và mở App Shopee...</h3>
                <p>Vui lòng chờ trong giây lát.</p>
            </div>
        </body>
        </html>
    `);
}
