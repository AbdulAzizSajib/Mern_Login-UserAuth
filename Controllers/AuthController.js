import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../Models/UserModel.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists, you can login",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({ name, email, password: encryptedPassword });
    await newUser.save();

    res.status(201).json({
      message: "Signup successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    const error_mailMsg = "User doesn't exist";
    const error_PassMsg = "Invalid Credentials , try again";

    if (!user) {
      return res.status(403).json({ message: error_mailMsg, success: false });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res.status(403).json({ message: error_PassMsg, success: false });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login success",
      success: true,
      jwtToken,
      // email,
      // name: user.name,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Admin Routes
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Create a JWT token with payload
      const token = jwt.sign({ email }, process.env.JWT_SECRET);

      return res.json({
        success: true,
        token,
        message: "Welcome admin user",
      });
    } else {
      // Invalid credentials
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred",
    });
  }
};

// CRUD Operations
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user
    await UserModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// export const getUser = (req, res) => {};
// export const getSingleUser = (req, res) => {};
// export const updateUser = (req, res) => {};

// Get all users
export const getUser = async (req, res) => {
  try {
    const users = await UserModel.find({}, "-password -__v"); // exclude password field
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get a single user by ID
export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id, "-password"); // exclude password field

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Single User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent password updates here (you could handle password separately)
    if (updateData.password) {
      delete updateData.password;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
