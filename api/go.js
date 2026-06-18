import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    let url_san_pham = req.query.url || '';
    const aff_type = req.query.aff_type || 'pure';

    if (!url_san_pham) {
        return res.status(400).send("Vui lòng nhập link sản phẩm Shopee!");
    }

    if (url_san_pham.includes('?')) {
        url_san_pham = url_san_pham.split('?')[0];
    }

    // 🔥 ID AFFILIATE CỦA CHÍNH ANH
    const my_affiliate_id = "17322830423"; 

    // 📁 ĐƯỜNG DẪN TỰ ĐỘNG ĐỌC FILE TOKEN RIÊNG BIỆT
    const dirPath = path.join(process.cwd(), 'api');
    
    let kho_token_facebook = [];
    let kho_token_instagram = [];

    // Tự động nạp dữ liệu từ các file riêng nếu file tồn tại
    try {
        const fbData = fs.readFileSync(path.join(dirPath, 'token_fb.json'), 'utf8');
        kho_token_facebook = JSON.parse(fbData);
    } catch (e) { kho_token_facebook = []; }

    try {
        const igData = fs.readFileSync(path.join(dirPath, 'token_ig.json'), 'utf8');
        kho_token_instagram = JSON.parse(igData);
    } catch (e) { kho_token_instagram = []; }

    let token_strings = "";

    // Luồng tự động bốc ngẫu nhiên Token từ file riêng để xoay vòng
    if (aff_type === 'facebook' && kho_token_facebook.length > 0) {
        const randomFB = kho_token_facebook[Math.floor(Math.random() * kho_token_facebook.length)];
        token_strings = `?utm_source=an_${my_affiliate_id}&mmp_pid=an_${my_affiliate_id}&utm_medium=affiliates&utm_campaign=-&utm_content=product----&credential_token=${randomFB.token}&uls_trackid=${randomFB.trackid}`;
    } 
    else if (aff_type === 'instagram' && kho_token_instagram.length > 0) {
        const randomIG = kho_token_instagram[Math.floor(Math.random() * kho_token_instagram.length)];
        token_strings = `?utm_source=an_${my_affiliate_id}&mmp_pid=an_${my_affiliate_id}&utm_medium=affiliates&utm_campaign=-&utm_content=product----&credential_token=${randomIG.token}&uls_trackid=${randomIG.trackid}`;
    }

    let link_goc_co_token = url_san_pham;
    if (aff_type !== 'pure' && token_strings !== "") {
        link_goc_co_token = url_san_pham + token_strings;
    }

    const link_chuyen_huong_shopee = `https://s.shopee.vn/an_redir?origin_link=${encodeURIComponent(link_goc_co_token)}&affiliate_id=${my_affiliate_id}&sub_id=product----`;

    // Trả về HTML mồi đồng bộ Session chuẩn 100%
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
