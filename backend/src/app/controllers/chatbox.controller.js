const { GEMINI_API_URL, DB_SCHEMA } = require("../controllers/promt");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const modelMap = {
  carts: Cart,
  orders: Order,
  products: Product,
  users: User,
};

class ChatBoxController {
  async getAnswer(req, res) {
    const { question } = req.body;
    const fullPrompt = DB_SCHEMA + `\n\nCâu hỏi: "${question}"`;
    // Gọi AI để chuyển đổi câu hỏi sang truy vấn MongoDB
    const aiResponse = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: fullPrompt }],
          },
        ],
      }),
    });

    const aiJson = await aiResponse.json();
    const mongoQueryText = aiJson.candidates[0].content.parts[0].text;

    const parsedQuery = parseMongoQuery(mongoQueryText);
    console.log(parsedQuery);

    if (!parsedQuery) {
      return res.status(400).send("Truy vấn không hợp lệ.");
    }

    const {
      model: modelName,
      filter,
      projection,
      sort,
      limit,
      skip,
      populate,
    } = parsedQuery;

    try {
      const Model = modelMap[modelName];
      if (!Model) return res.status(400).send("❌ Model không hợp lệ.");
      let cursor = Model.find(filter || {}, projection || {});

      if (populate && Array.isArray(populate)) {
        populate.forEach((pop) => {
          cursor = cursor.populate(pop);
        });
      }

      if (sort) cursor = cursor.sort(sort);
      if (skip) cursor = cursor.skip(skip);
      if (limit) cursor = cursor.limit(limit);
      // console.log(cursor);

      const result = await cursor.exec();
      const cleanResult = result.map((doc) =>
        doc.toObject ? doc.toObject() : doc
      ); // chuyển thành plain object

      // res.send(JSON.stringify(result, null, 2));
      console.log(cleanResult);
      const markdown = jsonToMarkdownTable(cleanResult);
      res.send(markdown);
    } catch (err) {
      console.error("Lỗi truy vấn MongoDB:", err.message);
      res.status(500).send("Lỗi khi truy vấn MongoDB.");
    }
  }
}

function parseMongoQuery(mongoQueryText) {
  try {
    // Bước 1: Loại bỏ markdown code block nếu có
    let cleanedText = mongoQueryText
      .replace(/^```(?:json)?\s*/i, "") // Xóa dòng mở đầu ``` hoặc ```json
      .replace(/```$/, "") // Xóa dòng kết thúc ```
      .trim();

    // Bước 2: Cắt chuỗi JSON hợp lệ (nếu có đoạn dư sau }
    const firstCurly = cleanedText.indexOf("{");
    const lastCurly = cleanedText.lastIndexOf("}");
    if (firstCurly === -1 || lastCurly === -1 || lastCurly <= firstCurly) {
      throw new Error("Không tìm thấy JSON hợp lệ trong chuỗi.");
    }

    const jsonString = cleanedText.substring(firstCurly, lastCurly + 1);

    // Bước 3: Parse an toàn
    const query = JSON.parse(jsonString);

    return {
      model: query.collection,
      filter: query.filter || {},
      projection: query.projection || undefined,
      sort: query.sort || undefined,
      limit: typeof query.limit === "number" ? query.limit : undefined,
      skip: typeof query.skip === "number" ? query.skip : undefined,
      populate: query.populate || undefined,
    };
  } catch (err) {
    console.error("❌ Lỗi khi phân tích mongoQueryText:", err.message);
    return null;
  }
}
function flattenObject(obj, parentKey = "") {
  const result = {};
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    const value = obj[key];
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

function flattenObject(obj, parentKey = "") {
  const result = {};
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    const value = obj[key];
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    // Nếu là ObjectId (có hàm toHexString hoặc toString riêng), convert sang string và không đệ quy vào
    if (
      value &&
      typeof value === "object" &&
      typeof value.toHexString === "function"
    ) {
      result[newKey] = value.toHexString();
    }
    // Nếu là object thường và không phải array, tiếp tục đệ quy
    else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

function jsonToMarkdownTable(data) {
  if (!Array.isArray(data) || data.length === 0) return "Không có dữ liệu.";

  const transformedData = data.map((item) => flattenAndTransform(item));

  // Lấy tất cả header (duy nhất)
  const headerSet = new Set();
  transformedData.forEach((item) => {
    Object.keys(item).forEach((key) => headerSet.add(key));
  });
  const headers = [...headerSet];

  // Tạo bảng markdown
  const headerRow = `| STT | ${headers.join(" | ")} |`;
  const separatorRow = `|-----|${headers.map(() => "---").join("|")}|`;

  const rows = transformedData.map((item, idx) => {
    const row = headers
      .map((key) => {
        const value = item[key];
        return typeof value === "object"
          ? JSON.stringify(value)
          : String(value ?? "");
      })
      .join(" | ");
    return `| ${idx + 1} | ${row} |`;
  });

  return [headerRow, separatorRow, ...rows].join("\n");
}

function flattenAndTransform(obj, parentKey = "", result = {}) {
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    const value = obj[key];

    // Bỏ qua các trường có tên là _id
    if (key === "_id") continue;

    const newKey = parentKey ? `${parentKey}.${key}` : key;

    // Nếu là ObjectId (chuyển sang string)
    if (value && typeof value.toHexString === "function") {
      result[newKey] = value.toHexString();
    }
    // Nếu là object thường, đệ quy tiếp
    else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      flattenAndTransform(value, newKey, result);
    }
    // Trường đơn giản
    else {
      result[newKey] = value;
    }
  }

  return result;
}

module.exports = new ChatBoxController();
