export default async function handler(req, res) {
    let url_san_pham = req.query.url || '';
    const aff_type = req.query.aff_type || 'pure';

    if (!url_san_pham) {
        return res.status(400).send("Vui lòng nhập link sản phẩm Shopee!");
    }

    // Làm sạch link sản phẩm của khách
    if (url_san_pham.includes('?')) {
        url_san_pham = url_san_pham.split('?')[0];
    }

    // 🔥 ID AFFILIATE CỦA CHÍNH ANH ĐỂ NHẬN HOA HỒNG
    const my_affiliate_id = "17322830423"; 

    // 📦 KHO LINK NỀN KOL (Anh đi rình lấy 1-2 link s.shopee.vn ăn mã MXH của bên khác dán cố định ở đây làm mồi)
    const kho_link_kol_ig = [
        "https://s.shopee.vn/6Km6Uxxx", 
        "https://s.shopee.vn/7Am9Zxxx"
    ];

    let live_token = "";
    let live_trackid = "";

    if (aff_type === 'instagram' && kho_link_kol_ig.length > 0) {
        try {
            const randomKOL = kho_link_kol_ig[Math.floor(Math.random() * kho_token_instagram.length)];
            
            // 🔥 MẤU CHỐT: Ép link KOL mồi phải đi vào ĐÚNG SẢN PHẨM mà khách đang muốn mua
            // Bằng cách nối thêm origin_link của sản phẩm đó vào lệnh gọi ngầm
            const url_quet_token = `${randomKOL}?origin_link=${encodeURIComponent(url_san_pham)}`;

            // Gửi lệnh giả lập cướp Token thời gian thực cho CHÍNH SẢN PHẨM ĐÓ
            const response = await fetch(url_quet_token, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
                    'Referer': 'https://l.instagram.com/', // Giả lập click từ Instagram
                },
                redirect: 'manual' // Chặn không cho Shopee nhảy trang để bóc tách lấy Token
            });

            const redirectUrl = response.headers.get('location') || '';
            
            // Nhặt Token đã được khóa riêng cho sản phẩm này
            if (redirectUrl.includes('credential_token=')) {
                const urlObj = new URL(redirectUrl);
                live_token = urlObj.searchParams.get('credential_token') || "";
                live_trackid = urlObj.searchParams.get('uls_trackid') || "";
            }
        } catch (error) {
            console.log("Lỗi luộc token:", error);
        }
    }

    // Ráp nối thành chuỗi hoàn chỉnh
    let token_strings = "";
    if (live_token && live_trackid) {
        token_strings = `?utm_source=an_${my_affiliate_id}&mmp_pid=an_${my_affiliate_id}&utm_medium=affiliates&utm_campaign=-&utm_content=product----&credential_token=${live_token}&uls_trackid=${live_trackid}`;
    } else {
        // Dự phòng nếu lỗi thì dùng mã mặc định
        token_strings = `?utm_source=an_${my_affiliate_id}&mmp_pid=an_${my_affiliate_id}&utm_medium=affiliates&utm_campaign=-&utm_content=product----&credential_token=8wEwiDL7Z2Us4W7ZvDpoeD6hrmpQqii6GUTr2TpSgu&uls_trackid=55tob7ui00cq`;
    }

    let link_goc_co_token = url_san_pham + token_strings;
    const link_chuyen_huong_shopee = `https://s.shopee.vn/an_redir?origin_link=${encodeURIComponent(link_goc_co_token)}&affiliate_id=${my_affiliate_id}&sub_id=product----`;

    // Trả về HTML mồi đồng bộ hệ thống
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
