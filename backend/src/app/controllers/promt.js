const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB65bihIs-2Fgf_svoKrnFtu4A8s7k0Hwc";

const DB_SCHEMA = `
Database gồm các collection chính:

1. users:
- _id: Mã người dùng
- account: Tên tài khoản đăng nhập
- password: Mật khẩu đã được mã hóa (băm)
- role: Vai trò của người dùng (ví dụ: "user" – người dùng thông thường, có thể có "admin" hoặc vai trò khác)
- address: Địa chỉ người dùng
- phone: Số điện thoại người dùng
- email: Địa chỉ email người dùng

VD:
{
  "_id": {
    "$oid": "681da8ecf5d3153b6d84105c"
  },
  "account": "t5",
  "password": "$2b$10$emDFgq6kzx6p.j/BRDaouupStBLcsgf1mWCIwu1GmbTLOEmml9FYG",
  "role": "user",
  "address": "1 Dai Co Viet",
  "phone": "1234567981",
  "email": "@@@"
}

2. products:
- _id: Mã sản phẩm
- title: Tên sản phẩm
- price: Giá sản phẩm (đơn vị USD)
- detail: Mô tả chi tiết về sản phẩm
- img: Đường dẫn hình ảnh đại diện sản phẩm
- amount: Số lượng sản phẩm còn lại trong kho

VD:
{
  "_id": {
    "$oid": "67fdc4db18010042f8075ee0"
  },
  "title": "LAY'S CLASSIC® Potato Chips",
  "price": 1.21,
  "detail": "It all starts with farm-grown potatoes, cooked and seasoned to perfection. So every LAY'S® potato chip is perfectly crispy and full of fresh potato taste. Happiness in Every Bite.®",
  "img": "https://www.lays.com/sites/lays.com/files/2020-11/lays-Classic-small.jpg",
  "amount": 43
}

3. orders:
- _id: Mã đơn hàng
- user: Mã người dùng đã đặt hàng
- products: Danh sách sản phẩm trong đơn hàng, bao gồm:
  - product: Mã sản phẩm
  - quantity: Số lượng sản phẩm được đặt
- total: Tổng giá trị đơn hàng
- phone: Số điện thoại người nhận
- address: Địa chỉ giao hàng
- payment: Phương thức thanh toán (ví dụ: COD = Thanh toán khi nhận hàng)
- status: Trạng thái đơn hàng (ví dụ: reject = bị từ chối)
- date: Ngày đặt hàng

VD:
{
  "_id": {
    "$oid": "680466ec9e6a63b786aa46aa"
  },
  "user": {
    "$oid": "5f6c2d8f4b7d421ab0eabc12"
  },
  "products": [
    {
      "product": {
        "$oid": "67fdc4db18010042f8075ee4"
      },
      "quantity": 5,
      "_id": {
        "$oid": "680466ec9e6a63b786aa46ab"
      }
    },
    {
      "product": {
        "$oid": "67fdc4db18010042f8075ee6"
      },
      "quantity": 3,
      "_id": {
        "$oid": "680466ec9e6a63b786aa46ac"
      }
    },
    {
      "product": {
        "$oid": "67fdc4db18010042f8075ee7"
      },
      "quantity": 2,
      "_id": {
        "$oid": "680466ec9e6a63b786aa46ad"
      }
    }
  ],
  "total": 158,
  "phone": "02438696099",
  "address": "1 Đ. Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội",
  "payment": "COD",
  "status": "reject",
  "date": {
    "$date": "2025-04-20T03:15:56.043Z"
  },
}

4. carts:
- _id: Mã giỏ hàng
- user: Mã người dùng sở hữu giỏ hàng
- products: Danh sách sản phẩm trong giỏ hàng, bao gồm:
  - product: Mã sản phẩm
  - quantity: Số lượng sản phẩm được thêm vào giỏ
  - addedAt: Ngày giờ sản phẩm được thêm vào
VD:
{
  "_id": {
    "$oid": "680aebed155bbae3ea5da09c"
  },
  "user": {
    "$oid": "6807490d256428229583cbe0"
  },
  "products": [
    {
      "product": {
        "$oid": "67fdc4db18010042f8075ee0"
      },
      "quantity": 8,
      "addedAt": {
        "$date": "2025-04-25T02:01:56.097Z"
      },
      "_id": {
        "$oid": "680aebed155bbae3ea5da09e"
      }
    },
    {
      "product": {
        "$oid": "67fdc4db18010042f8075ee1"
      },
      "quantity": 5,
      "addedAt": {
        "$date": "2025-04-25T02:00:45.123Z"
      },
      "_id": {
        "$oid": "680aebf4155bbae3ea5da0aa"
      }
    },
    {
      "product": {
        "$oid": "67fdc4db18010042f8075ee2"
      },
      "quantity": 4,
      "addedAt": {
        "$date": "2025-04-25T02:00:45.123Z"
      },
      "_id": {
        "$oid": "680aebf9155bbae3ea5da0b9"
      }
    },
    {
      "product": {
        "$oid": "67fdc4db18010042f8075ee7"
      },
      "quantity": 2,
      "addedAt": {
        "$date": "2025-04-25T02:01:39.425Z"
      },
      "_id": {
        "$oid": "680aec6c0c076b2b355e3901"
      }
    },
    {
      "product": {
        "$oid": "67fdc4db18010042f8075ee8"
      },
      "quantity": 1,
      "addedAt": {
        "$date": "2025-04-25T02:01:48.640Z"
      },
      "_id": {
        "$oid": "680aed0ca1ee4ef4716296d7"
      }
    }
  ],
}

Yêu cầu: Chuyển câu hỏi tiếng Việt bên dưới thành truy vấn MongoDB JSON.
Chỉ trả về JSON chứa các phần như: collection, filter, sort, limit, projection, populate.
Nếu có sử dụng populate, thì không nên dùng projection trỏ vào các trường con bên trong đường dẫn populate (ví dụ: student_id.name).
Không giải thích gì thêm, chỉ trả về JSON hợp lệ.

`;

module.exports = {
  GEMINI_API_URL,
  DB_SCHEMA,
};
