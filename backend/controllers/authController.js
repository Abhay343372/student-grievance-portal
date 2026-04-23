const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new student
// @route   POST /api/register
// @access  Public
const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate Input Fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all required fields (name, email, password)' });
    }

    // 2. Handle Duplicate Email
    const studentExists = await Student.findOne({ email });

    if (studentExists) {
      return res.status(400).json({ message: 'A student with this email already exists' });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create Student
    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
    });

    if (student) {
      console.log(`New student registered: ${student.email}`);
      res.status(201).json({
        _id: student.id,
        name: student.name,
        email: student.email,
        token: generateToken(student._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid student data received' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error during registration' });
  }
};

// @desc    Authenticate a student
// @route   POST /api/login
// @access  Public
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate Input Fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    // Check for student email
    const student = await Student.findOne({ email });

    // Validate password
    if (student && (await bcrypt.compare(password, student.password))) {
      console.log(`Student logged in: ${student.email}`);
      res.json({
        _id: student.id,
        name: student.name,
        email: student.email,
        token: generateToken(student._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error during login' });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
};
