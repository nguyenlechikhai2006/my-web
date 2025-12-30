const axios = require('axios');

exports.checkBankingPayment = async (req, res) => {
  try {
    const { memo, amount } = req.query;
    
    // 1. Lấy API Key từ biến môi trường
    const apiKey = process.env.CASSO_API_KEY;

    if (!apiKey) {
      console.error("LỖI: Chưa cấu hình CASSO_API_KEY trong file .env"); // Hỗ trợ debug
      return res.status(500).json({ ok: false, message: "Hệ thống chưa sẵn sàng thanh toán" });
    }

    // 2. Gọi API Casso lấy các giao dịch mới nhất
    // Tăng pageSize lên 50 để đảm bảo không bỏ lỡ giao dịch khi có nhiều người cùng mua
    const response = await axios.get('https://api.casso.vn/v2/transactions?pageSize=50&sort=DESC', {
      headers: {
        'Authorization': `Apikey ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const transactions = response.data.data.records || [];
    
    // 3. Logic đối soát thông minh & Chặt chẽ
    const isPaid = transactions.some(tr => {
      // Chuyển về chữ HOA và xóa khoảng trắng thừa để so sánh chính xác tuyệt đối
      const trDescription = tr.description ? tr.description.toUpperCase().replace(/\s/g, '') : "";
      const searchMemo = memo ? memo.toUpperCase().replace(/\s/g, '') : "";
      
      const targetAmount = Number(amount);
      
      // Kiểm tra thêm: Giao dịch phải xảy ra trong vòng 24h qua (tránh trùng mã đơn cũ)
      const trDate = new Date(tr.when);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      return (
        trDescription.includes(searchMemo) && 
        tr.amount >= targetAmount &&
        trDate > oneDayAgo
      );
    });

    // 4. Trả về đúng định dạng Frontend đang đợi (Phải có thuộc tính 'paid')
    res.status(200).json({ 
      ok: true, 
      paid: isPaid 
    });

  } catch (error) {
    // Log lỗi chi tiết để bạn dễ dàng sửa nếu Casso đổi API
    console.error("Lỗi Casso API:", error.response?.data || error.message);
    res.status(500).json({ 
      ok: false, 
      paid: false, 
      message: "Lỗi kết nối ngân hàng, vui lòng thử lại sau" 
    });
  }
};