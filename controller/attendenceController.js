import Attendance from "../models/Attendence.js";
import Employee from "../models/Employee.js";

// ✅ POST /api/attendence/add
const addAttendence = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.body;

    console.log(status)

    if (!status || !["Present", "Absent", "halfday"].includes(status)) {
      return res.status(400).json({ error: "Invalid or missing status" });
    }

    const employee = await Employee.findOne({ userId });
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const today = new Date().toISOString().split('T')[0];
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      employee: employee._id,
      date: today,
    });

    if (existing) {
      return res.status(200).json({ message: "Already marked", status: existing.status });
    }

    const attendance = new Attendance({
      employee: employee._id,
      date: today,
      status,
    });

    await attendance.save();

    return res.status(201).json({ success: true, message: "Attendance marked", attendance });
  } catch (error) {
    console.error("Error marking attendance:", error.message);
    res.status(500).json({ error: "Server error marking attendance" });
  }
};

// ✅ GET /api/attendence/status?date=YYYY-MM-DD
const getTodayStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.query;

    if (!date) return res.status(400).json({ error: "Date is required" });

    const employee = await Employee.findOne({ userId });
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const record = await Attendance.findOne({
      employee: employee._id,
      date: targetDate,
    });

    res.status(200).json({ status: record?.status || "Unmarked" });
  } catch (error) {
    console.error("Error fetching today's status:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ GET /api/attendence/monthly-records/:userId
const getMonthlyRecords = async (req, res) => {
  try {
    const { userId } = req.params;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required" });
    }

    const employee = await Employee.findOne({ userId });
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const records = await Attendance.find({
      employee: employee._id,
      date: { $gte: start, $lte: end },
    }).sort("date");

    res.json({ records });
  } catch (err) {
    console.error("Error getting monthly records:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ PUT /api/attendence/update/:userId
const adminUpdateAttendance = async (req, res) => {
  try {
    const { userId, date, status } = req.body;

    if (!userId || !date || !status) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const employee = await Employee.findOne({ userId });
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      employee: employee._id,
      date: targetDate,
    });

    if (existing) {
      existing.status = status;
      await existing.save();
    } else {
      const newRecord = new Attendance({
        employee: employee._id,
        date: targetDate,
        status,
      });
      await newRecord.save();
    }

    res.json({ success: true, message: "Attendance updated" });
  } catch (err) {
    console.error("Admin update error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export {
  addAttendence,
  getTodayStatus,
  getMonthlyRecords,
  adminUpdateAttendance,
};
