const mongoose = require('mongoose');

// สร้างตัวแปรมาเก็บสถานะการเชื่อมต่อ
let isConnected = false; 

const connectDB = async () => {
  // 1. ถ้าเชื่อมต่ออยู่แล้ว ให้ใช้ของเดิม ไม่ต้องต่อใหม่ (สำคัญมากบน Vercel)
  if (isConnected) {
    console.log('=> using existing database connection');
    return;
  }

  // 2. ถ้ายังไม่เชื่อมต่อ ให้เริ่มต่อ MongoDB
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = conn.connections[0].readyState; // อัปเดตสถานะว่าต่อสำเร็จแล้ว
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // ข้อควรระวัง: อย่าใส่ process.exit(1) ในโหมด Serverless ไม่งั้นแอปจะพังทั้งหน้า
    // ให้ throw error แทน หรือปล่อยให้ฟังก์ชันจบไป
    throw new Error('Database connection failed'); 
  }
};

module.exports = connectDB;