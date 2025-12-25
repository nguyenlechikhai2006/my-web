const axios = require('axios');

exports.checkBankingPayment = async (req, res) => {
  try {
    const { memo, amount } = req.query;
    const apiKey = process.env.CASSO_API_KEY;

    // Gọi API Casso lấy các giao dịch mới nhất
    const response = await axios.get('https://api.casso.vn/v2/transactions?pageSize=15&sort=DESC', {
      headers: {
        'Authorization': `Apikey ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const transactions = response.data.data.records;

    // Logic: Tìm giao dịch khớp cả Mã nội dung (memo) và Số tiền (amount)
    const isPaid = transactions.some(tr => 
      tr.description.toUpperCase().includes(memo.toUpperCase()) && 
      tr.amount >= parseInt(amount)
    );

    res.status(200).json({ 
      ok: true, 
      paid: isPaid 
    });
  } catch (error) {
    console.error("Lỗi Casso API:", error.message);
    res.status(500).json({ ok: false, message: "Không thể kiểm tra thanh toán lúc này" });
  }
};