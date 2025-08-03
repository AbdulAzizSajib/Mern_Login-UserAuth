import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../Models/UserModel.js";

const createToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10h",
    }
  );
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists, you can login",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      name,
      email,
      password: encryptedPassword,
      isAdmin,
    });
    await newUser.save();

    res.json({
      message: "Signup successfully",
      success: true,
    });
  } catch (err) {
    res.json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({ message: "User doesn't exist", success: false });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res.json({ message: "Invalid Credentials", success: false });
    }

    const token = createToken(user);

    return res.json({
      message: "Login success",
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        _id: user._id,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    return res.json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Admin Routes
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({ message: "User doesn't exist", success: false });
    }

    if (!user.isAdmin) {
      return res.json({
        success: false,
        message: "You are not authorized to login",
      });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);

    if (!isPassMatch) {
      return res.json({
        success: false,
        message: "Invalid Credentials, try again",
      });
    }

    if (isPassMatch && user.isAdmin) {
      const token = createToken(user); // ✅ generate token properly

      return res.json({
        // ✅ success status
        success: true,
        message: "Admin login successful",
        token,
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
          isAdmin: user.isAdmin,
        },
      });
    }
  } catch (err) {
    console.error("Admin Login Error:", err);
    return res.json({
      success: false,
      message: "Internal server error",
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
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user
    await UserModel.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.json({
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
    const total = await UserModel.countDocuments({});
    return res.json({
      success: true,
      users,
      total,
    });
  } catch (error) {
    console.error("Get Users Error:", error);
    return res.json({
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
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Single User Error:", error);
    return res.json({
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
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.json({
      success: false,
      message: "Internal server error",
    });
  }
};

// update password
export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.json({
      success: false,
      message: "Internal server error",
    });
  }
};

// update Profile

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields if they are provided
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        _id: updatedUser._id,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.json({
      success: false,
      message: "Internal server error",
    });
  }
};
