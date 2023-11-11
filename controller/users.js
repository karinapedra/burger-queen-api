const bcrypt = require('bcrypt');
const User = require('../models/User');

const createUser = async (req, resp) => {
  try {
    const {
      email,
      name,
      password,
      role,
    } = req.body;

    if (!email || !password || !role || !name) {
      return resp.status(400).json({ error: 'All fields are required' });
    }

    const verifyEmail = await User.findOne({ email });

    if (!verifyEmail) {
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        name,
        password: passwordHash,
        role,
      });
      await newUser.save();
      newUser.password = undefined;

      resp.status(201).json({ newUser });
    } else {
      return resp.status(403).json({ error: 'Email already registered' });
    }
  } catch (error) {
    resp.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUsers = async (req, resp) => {
  try {
    const users = await User.find();
    users.forEach((user) => {
      user.password = undefined;
    });
    resp.json(users);
  } catch (error) {
    resp.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserById = async (req, resp) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      resp.status(404).json({ error: 'User not found' });
    }

    user.password = undefined;
    resp.json(user);
  } catch (error) {
    if (error.reason) {
      resp.status(404).json({ error: 'User not found' });
    } else {
      resp.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

const updateUser = async (req, resp) => {
  try {
    const userId = req.params.id;
    const {
      email,
      name,
      password,
      role,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        email,
        name,
        passwordHash,
        role,
      },
      { new: true },
    );

    if (!updatedUser) {
      resp.status(404).json({ error: 'User not found' });
    }

    updatedUser.password = undefined;

    resp.json({ updatedUser });
  } catch (error) {
    if (error.reason) {
      resp.status(404).json({ error: 'User not found' });
    } else {
      resp.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

const deleteUser = async (req, resp) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      resp.status(404).json({ error: 'User not found' });
    }

    resp.status(200).json({ message: 'Successfully deleted' });
  } catch (error) {
    if (error.reason) {
      resp.status(404).json({ error: 'User not found' });
    } else {
      resp.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
