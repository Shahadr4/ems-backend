import Department from "../models/Department.js";

const getDepartments = async (req, res) => {


    try {

        const departments = await Department.find(); // Fetch all departments from the database
        return res.status(200).json({ success: true, departments }); // Return success response with the list of departments
        
    } catch (error) {
        return res.status(500).json({ success: false, error: "get department Server error" });
        
    }

}



const addDepartment = async (req, res) => {


    try {
        const {dep_name, description} = req.body; // Extract department name and description from request body
        const newDepartment = new Department({
            dep_name,
            description
        })
        await newDepartment.save(); // Save the new department to the database
        return res.status(201).json({ success: true, message: "Department added successfully", department: newDepartment }); // Return success response with the new department data
        
    } catch (error) {
        return res.status(500).json({ success: false, error: "add departmentServer error" });// If an error occurs, return 500

        
    }



}



const getDepartment= async(req,res)=>{
    try {
        const { id } = req.params; // Get department ID from request parameters
        const department = await Department.findById(id ); // Find the department by ID
        return res.status(200).json({ success: true, department }); // Return success response with the department data 
    } catch (error) {
        return res.status(500).json({ success: false, error: "edit department Server error" });
        
    }
}

const updateDepartment = async (req, res) => {
    try {
        const {id}= req.params; // Get department ID from request parameters
        const { dep_name, description } = req.body; // Extract updated department name and description
        const updatedDepartment = await Department.findByIdAndUpdate(id, { dep_name, description }); 
        // Update the department in the database
        return res.status(200).json({ success: true, message: "Department updated successfully", department: updatedDepartment });
    } catch (error) {
        return res.status(500).json({ success: false, error: "update department Server error" });
        
    }

}

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDepartment = await Department.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
      department: deletedDepartment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Delete department server error",
    });
  }
};



export { addDepartment , getDepartments,getDepartment, updateDepartment ,deleteDepartment};