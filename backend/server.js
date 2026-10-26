
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Employee Management API is running");
});

app.get("/employees", (req, res) => {
  res.json([]);
});

app.post("/employees", (req, res) => {
  const { name, email, department, salary, employees = [] } = req.body;

  if (
    !name?.trim() ||
    !email?.trim() ||
    !department?.trim() ||
    salary === undefined ||
    salary === "" ||
    !Number.isFinite(Number(salary)) ||
    Number(salary) < 0
  ) {
    return res.status(400).json({
      message: "Please enter valid employee details"
    });
  }

  const emailExists = employees.find(
    (emp) => emp.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (emailExists) {
    return res.status(400).json({
      message: "Email already exists"
    });
  }

  res.status(201).json({
    message: "Employee details validated successfully"
  });
});

app.put("/employees/:id", (req, res) => {
  const { name, email, department, salary, employees = [] } = req.body;
  const id = Number(req.params.id);

  if (
    !name?.trim() ||
    !email?.trim() ||
    !department?.trim() ||
    salary === undefined ||
    salary === "" ||
    !Number.isFinite(Number(salary)) ||
    Number(salary) < 0
  ) {
    return res.status(400).json({
      message: "Please enter valid employee details"
    });
  }

  const emailExists = employees.find(
    (emp) =>
      emp.email.toLowerCase() === email.trim().toLowerCase() &&
      emp.id !== id
  );

  if (emailExists) {
    return res.status(400).json({
      message: "Email already exists"
    });
  }

  res.json({
    message: "Employee details validated successfully"
  });
});

app.delete("/employees/:id", (req, res) => {
  res.json({ message: "Delete request received" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});