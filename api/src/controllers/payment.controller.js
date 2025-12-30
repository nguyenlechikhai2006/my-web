const axios = require('axios');

exports.checkBankingPayment = async (req, res) => {
  try {
    const { memo, amount } = req.query;
    const apiKey = process.env.CASSO_API_KEY;

    // 1. Kiểm tra đầu vào để tránh crash server (Lỗi 500)
    if (!memo || !amount) {
      return res.status(200).json({ ok: false, paid: false, message: "Thiếu thông tin đối soát" });
    }

    if (!apiKey) {
      console.error("LỖI: Chưa cấu hình CASSO_API_KEY trên Render Dashboard");
      return res.status(200).json({ ok: false, paid: false, message: "Hệ thống chưa nạp API Key" });
    }

    // 2. Gọi API Casso với cấu hình tối ưu cho Render
    const response = await axios.get('https://api.casso.vn/v2/transactions?pageSize=20&sort=DESC', {
      headers: {
        'Authorization': `Apikey ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // Chờ tối đa 10 giây để tránh treo request trên Render
    });

    // Sử dụng Optional Chaining (?.) để tránh lỗi "cannot read property records of undefined"
    const transactions = response.data?.data?.records || [];

    // 3. Logic đối soát thông minh (Giữ nguyên logic cũ nhưng thêm xử lý an toàn)
    const isPaid = transactions.some(tr => {
      // Chuẩn hóa Description và Memo (Viết hoa, xóa khoảng trắng thừa)
      const trDescription = (tr.description || "").toUpperCase().replace(/\s/g, '');
      const searchMemo = memo.toUpperCase().replace(/\s/g, '');
      const targetAmount = Number(amount);

      return trDescription.includes(searchMemo) && tr.amount >= targetAmount;
    });

    // 4. Trả về đúng định dạng Frontend đang đợi (paid: true/false)
    res.status(200).json({ 
      ok: true, 
      paid: isPaid 
    });

  } catch (error) {
    // Thay vì trả về 500 làm sập Polling, trả về paid: false để Frontend tiếp tục thử lại
    console.error("Lỗi xác thực thanh toán:", error.response?.data || error.message);
    res.status(200).json({ 
      ok: false, 
      paid: false, 
      message: "Đang kết nối lại với ngân hàng..." 
    });
  }
};