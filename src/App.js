import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "", department: "", salary: "" });
  const [editingEmployee, setEditingEmployee] = useState(null);

  // ✅ Fetch Employees
  useEffect(() => {
    fetch("http://localhost:5000/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  // ✅ Add Employee
  const handleAddEmployee = () => {
    fetch("http://localhost:5000/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setEmployees([...employees, { ...newEmployee, id: data.employeeId }]);
        setNewEmployee({ name: "", email: "", department: "", salary: "" });
      })
      .catch((error) => console.error("Error adding employee:", error));
  };

  // ✅ Delete Employee
  const handleDelete = (id) => {
    fetch(`https://employee-backend.onrender.com/employees/${id}`, { method: "DELETE" })
      .then((response) => response.json())
      .then(() => {
        alert("Employee deleted!");
        setEmployees(employees.filter((emp) => emp.id !== id));
      })
      .catch((error) => console.error("Error deleting employee:", error));
  };

  // ✅ Edit Employee
  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setNewEmployee(emp);
  };

  // ✅ Update Employee
  const handleUpdateEmployee = () => {
    fetch(`http://localhost:5000/employees/${editingEmployee.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setEmployees(employees.map(emp => emp.id === editingEmployee.id ? newEmployee : emp));
        setEditingEmployee(null);
        setNewEmployee({ name: "", email: "", department: "", salary: "" });
      })
      .catch((error) => console.error("Error updating employee:", error));
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">Employee Management System</h1>

      <div className="mb-4">
        <h3>{editingEmployee ? "Edit Employee" : "Add Employee"}</h3>
        <input className="form-control mb-2" name="name" placeholder="Name" value={newEmployee.name} onChange={handleChange} />
        <input className="form-control mb-2" name="email" placeholder="Email" value={newEmployee.email} onChange={handleChange} />
        <input className="form-control mb-2" name="department" placeholder="Department" value={newEmployee.department} onChange={handleChange} />
        <input className="form-control mb-2" name="salary" placeholder="Salary" value={newEmployee.salary} onChange={handleChange} />
        {editingEmployee ? (
          <button className="btn btn-warning" onClick={handleUpdateEmployee}>Update Employee</button>
        ) : (
          <button className="btn btn-success" onClick={handleAddEmployee}>Add Employee</button>
        )}
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.salary}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(emp)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
