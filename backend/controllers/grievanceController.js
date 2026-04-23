const Grievance = require('../models/Grievance');

// @desc    Submit grievance
// @route   POST /api/grievances
// @access  Private
const submitGrievance = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const grievance = await Grievance.create({
      title,
      description,
      category,
      studentId: req.student.id,
    });

    res.status(201).json(grievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all grievances for logged in user
// @route   GET /api/grievances
// @access  Private
const getGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ studentId: req.student.id }).sort({ createdAt: -1 });
    res.status(200).json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search grievances by title
// @route   GET /api/grievances/search?title=xyz
// @access  Private
const searchGrievances = async (req, res) => {
  try {
    const title = req.query.title;
    
    if (!title) {
      return res.status(400).json({ message: 'Please provide a search title' });
    }

    const grievances = await Grievance.find({
      studentId: req.student.id,
      title: { $regex: title, $options: 'i' }
    });

    res.status(200).json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get grievance by ID
// @route   GET /api/grievances/:id
// @access  Private
const getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Check for student
    if (grievance.studentId.toString() !== req.student.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    res.status(200).json(grievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update grievance
// @route   PUT /api/grievances/:id
// @access  Private
const updateGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Check for student
    if (grievance.studentId.toString() !== req.student.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedGrievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedGrievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete grievance
// @route   DELETE /api/grievances/:id
// @access  Private
const deleteGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Check for student
    if (grievance.studentId.toString() !== req.student.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await grievance.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitGrievance,
  getGrievances,
  searchGrievances,
  getGrievanceById,
  updateGrievance,
  deleteGrievance,
};
