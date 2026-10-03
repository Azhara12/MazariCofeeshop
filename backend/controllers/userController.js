import User from '../models/User.js';
import Order from '../models/Order.js';
import generateToken from '../utils/generateToken.js';

// Primary Developer / Admin Email
const ADMIN_EMAIL = 'azharmahmoodmazari@gmail.com';

// @desc    Auth user & get token (With Auto-Admin Grant)
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Auto-grant Admin privileges if developer email is not marked as admin
      if (user.email === ADMIN_EMAIL && !user.isAdmin) {
        user.isAdmin = true;
        user.role = 'admin';
        await user.save();
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.isAdmin ? 'admin' : 'customer',
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Auto-set admin if registering with the primary admin email
    const isAdmin = email === ADMIN_EMAIL;

    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
      role: isAdmin ? 'admin' : 'customer',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.isAdmin ? 'admin' : 'customer',
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with live order counts for Admin Panel
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const usersWithOrderCount = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          role: user.isAdmin ? 'admin' : 'customer',
          orderCount,
        };
      })
    );

    res.status(200).json(usersWithOrderCount);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle User Role (Admin ↔ Customer)
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
const toggleUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.isAdmin = !user.isAdmin;
    user.role = user.isAdmin ? 'admin' : 'customer';

    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${user.role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User account removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export { authUser, registerUser, getAllUsers, toggleUserRole, deleteUser };