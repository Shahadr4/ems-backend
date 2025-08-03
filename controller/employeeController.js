import multer from "multer";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ✅ Configure Multer (memory-based for Vercel)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Add Employee Controller
const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      department,
      role,
      salary,
      gender,
      dob,
      password,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Convert image to Base64 if uploaded
    let profileImage = {};
    if (req.file) {
      profileImage = {
        data: req.file.buffer.toString("base64"),
        contentType: req.file.mimetype,
      };
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage,
    });

    const savedUser = await newUser.save();

    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      department,
      salary,
      dob,
      gender,
    });

    await newEmployee.save();

    return res.status(201).json({
      success: true,
      message: "Employee added successfully",
    });
  } catch (error) {
    console.error("Error adding employee:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// ✅ Get All Employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", { password: 0 }) // Exclude password
      .populate("department");

    res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ success: false, error: "Error getting employees" });
  }
};

// ✅ Get Single Employee
const getSingleEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    let employee = await Employee.findById(id)
      .populate("userId", { password: 0 })
      .populate("department");

    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate("userId", { password: 0 })
        .populate("department");
    }

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error("Error fetching employee:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ✅ Update Employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, salary, department } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ success: false, error: "Employee not found" });

    const user = await User.findById(employee.userId);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    // Update user fields
    if (name) user.name = name;
    if (req.file) {
      user.profileImage = {
        data: req.file.buffer.toString("base64"),
        contentType: req.file.mimetype,
      };
    }
    await user.save();

    // Update employee fields
    if (salary) employee.salary = salary;
    if (department) employee.department = department;
    await employee.save();

    res.status(200).json({ success: true, message: "Employee updated successfully" });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ success: false, error: "Server error while updating employee" });
  }
};

// ✅ Delete Employee
const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    await User.findByIdAndDelete(employee.userId); // Delete linked user
    await Employee.findByIdAndDelete(id);          // Delete employee

    res.status(200).json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export { addEmployee, upload, getEmployees, getSingleEmployee, updateEmployee, deleteEmployee };
