const axios = require('axios');

exports.checkBankingPayment = async (req, res) => {
  try {
    const { memo, amount } = req.query;
    
    // Gọi API Casso để lấy lịch sử giao dịch mới nhất
    const response = await axios.get('https://api.casso.vn/v2/transactions?pageSize=20&sort=DESC', {
      headers: {
        'Authorization': `Apikey YOUR_CASSO_API_KEY_CUA_BAN`, // Thay API Key của bạn vào đây
        'Content-Type': 'application/json'
      }
    });

    const transactions = response.data.data.records;
    
    // Tìm giao dịch khớp với Nội dung (Memo) và Số tiền (Amount)
    const isPaid = transactions.some(tr => 
      tr.description.includes(memo) && tr.amount >= parseInt(amount)
    );

    res.status(200).json({ success: true, paid: isPaid });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi kiểm tra từ Casso" });
  }
};