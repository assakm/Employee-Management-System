
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState(() => {
    const savedCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("employees="));

    if (!savedCookie) return [];

    try {
      return JSON.parse(
        decodeURIComponent(savedCookie.substring("employees=".length))
      );
    } catch {
      return [];
    }
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    document.cookie = `employees=${encodeURIComponent(
      JSON.stringify(employees)
    )}; max-age=604800; path=/; SameSite=Lax`;
  }, [employees]);

  const clearForm = () => {
    setName("");
    setEmail("");
    setDepartment("");
    setSalary("");
    setEditingId(null);
  };

  const addEmployee = () => {
    if (!name.trim() || !email.trim() ||
        !department.trim() || salary === "") {
      alert("Please fill in all employee details");
      return;
    }

    const emailExists = employees.find(
      (emp) =>
        emp.email.toLowerCase() === email.trim().toLowerCase() &&
        emp.id !== editingId
    );

    if (emailExists) {
      alert("Email already exists");
      return;
    }

    const employee = {
      id: editingId === null ? Date.now() : editingId,
      name: name.trim(),
      email: email.trim(),
      department: department.trim(),
      salary: Number(salary)
    };

    if (editingId === null) {
      setEmployees([...employees, employee]);
      alert("Employee added successfully");
    } else {
      setEmployees(employees.map((emp) =>
        emp.id === editingId ? employee : emp
      ));
      alert("Employee updated successfully");
    }

    clearForm();
  };

  const editEmployee = (emp) => {
    setEditingId(emp.id);
    setName(emp.name);
    setEmail(emp.email);
    setDepartment(emp.department);
    setSalary(String(emp.salary));
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));

    if (editingId === id) {
      clearForm();
    }
  };

  return (
    <div className="app-container">
      <h1>Employee Management System</h1>
      <h2>{editingId === null ? "Add Employee" : "Edit Employee"}</h2>

      <form onSubmit={(e) => e.preventDefault()}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <input
          placeholder="Salary"
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />

        <button type="button" onClick={addEmployee}>
          {editingId === null ? "Add Employee" : "Update Employee"}
        </button>

        {editingId !== null && (
          <button type="button" onClick={clearForm}>
            Cancel
          </button>
        )}
      </form>

      <h2>Employee List</h2>

      <div className="employee-row employee-heading">
        <span>Name</span>
        <span>Email</span>
        <span>Department</span>
        <span>Salary</span>
        <span>Action</span>
      </div>

      {employees.length === 0 ? (
        <p>No employees added yet.</p>
      ) : (
        employees.map((emp) => (
          <div className="employee-row" key={emp.id}>
            <span>{emp.name}</span>
            <span>{emp.email}</span>
            <span>{emp.department}</span>
            <span>₹{emp.salary}</span>
            <span>
              <button type="button" onClick={() => editEmployee(emp)}>
                Edit
              </button>
              <button type="button" onClick={() => deleteEmployee(emp.id)}>
                Delete
              </button>
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
