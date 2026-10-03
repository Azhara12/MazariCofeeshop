import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Setting from "../models/Setting.js";

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    console.log(`[Admin] Updating order ${id} → status: "${orderStatus}"`);

    // 1. Validate status value against schema enum
    const VALID_STATUSES = ['Order Received', 'Brewing', 'On the Way', 'Delivered', 'Cancelled'];
    if (!orderStatus || !VALID_STATUSES.includes(orderStatus)) {
      return res.status(400).json({
        message: `Invalid status "${orderStatus}". Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    // 2. Verify the order exists (Check both Mongo ObjectId and custom orderId)
    const isObjectId = /^[a-fA-F0-9]{24}$/.test(id);
    let existingOrder = null;

    if (isObjectId) {
      existingOrder = await Order.findById(id);
    }
    if (!existingOrder) {
      existingOrder = await Order.findOne({ orderId: id });
    }

    if (!existingOrder) {
      console.warn(`[Admin] Order not found for id: ${id}`);
      return res.status(404).json({ message: `Order not found with id: ${id}` });
    }

    // 3. Update status safely
    const updatedOrder = await Order.findByIdAndUpdate(
      existingOrder._id,
      { $set: { orderStatus } },
      { new: true }
    );

    console.log(`[Admin] ✅ Order ${updatedOrder.orderId || updatedOrder._id} status → "${orderStatus}"`);

    return res.status(200).json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('[Admin] updateOrderStatus ERROR:', error.name, '-', error.message);
    if (error.errors) {
      console.error('[Admin] Validation errors:', JSON.stringify(error.errors, null, 2));
    }
    next(error);
  }
};

// @desc    Get quick analytics stats (Admin)
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    // 1. Total Orders count
    const totalOrdersCount = await Order.countDocuments({});

    // 2. Pending Orders count (active, unfulfilled orders)
    const pendingOrdersCount = await Order.countDocuments({
      orderStatus: { $in: ['Order Received', 'Brewing', 'On the Way'] }
    });

    // 3. Calculate total revenue across non-cancelled orders
    // Order model stores revenue in: pricing.totalAmount
    const revenueAggregation = await Order.aggregate([
      {
        $match: {
          orderStatus: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $ifNull: [
                '$pricing.totalAmount',
                { $ifNull: ['$pricing.totalPrice', { $ifNull: ['$totalPrice', 0] }] }
              ]
            }
          }
        }
      }
    ]);

    const totalRevenue =
      revenueAggregation.length > 0 && revenueAggregation[0].totalRevenue
        ? revenueAggregation[0].totalRevenue
        : 0;

    // 4. Total Products count
    const totalProductsCount = await Product.countDocuments({});

    console.log(`[Admin Stats] Orders: ${totalOrdersCount}, Pending: ${pendingOrdersCount}, Revenue: $${totalRevenue}, Products: ${totalProductsCount}`);

    res.status(200).json({
      success: true,
      totalOrders: totalOrdersCount,
      pendingOrders: pendingOrdersCount,
      totalRevenue: parseFloat(Number(totalRevenue).toFixed(2)),
      totalProducts: totalProductsCount
    });
  } catch (error) {
    console.error('[Admin] getAdminStats ERROR:', error);
    next(error);
  }
};

// @desc    Promote a user to Admin by email
// @route   POST /api/admin/make-admin
// @access  Private/Admin
export const makeAdmin = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $set: { isAdmin: true } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: `No user found with email: ${email}` });
    }

    res.status(200).json({
      message: `✅ ${user.name} is now an Admin!`,
      user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get store settings
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getSettings = async (req, res, next) => {
  try {
    console.log('[Admin] GET /api/admin/settings');
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error('[Admin] getSettings ERROR:', error);
    next(error);
  }
};

// @desc    Update store settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSettings = async (req, res, next) => {
  try {
    console.log('[Admin] PUT /api/admin/settings', req.body);
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting(req.body);
    } else {
      const updates = { ...req.body };
      delete updates._id;
      delete updates.createdAt;
      delete updates.updatedAt;
      delete updates.__v;
      Object.assign(settings, updates);
    }
    const updatedSettings = await settings.save();
    console.log('[Admin] Settings saved successfully');
    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error('[Admin] updateSettings ERROR:', error);
    next(error);
  }
};