const Order = require("../models/Order");
const Customer = require("../models/Customer");

const createOrder = async (req, res) => {
  try {
    const { customer, products, bill, paid, billedBy, isReturn } = req.body;

    if (
      !Array.isArray(products) ||
      products.length === 0 ||
      bill === undefined ||
      paid === undefined ||
      !customer
    ) {
      return res.status(400).json({ message: "Mandatory fields are missing" });
    }

    if (
      typeof bill !== "number" ||
      bill < 0 ||
      typeof paid !== "number" ||
      paid < 0
    ) {
      return res
        .status(400)
        .json({ message: "Bill and Paid must be non-negative numbers" });
    }

    const foundCustomer = await Customer.findById(customer);
    if (!foundCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const oldBalance = foundCustomer.outstandingAmount || 0;

    const adjustedBill = isReturn ? -bill : bill;
    const total = oldBalance + adjustedBill;
    const newBalance = total - paid;

    const existingOrder = await Order.findOne({
      customer,
      bill,
      createdAt: { $gte: new Date(Date.now() - 10000) }, // last 10s
    });

    if (existingOrder) {
      return res
        .status(409)
        .json({ message: "Duplicate order detected in the last 10 seconds" });
    }

    const newOrder = new Order({
      customer,
      products,
      bill,
      oldBalance,
      total,
      paid,
      newBalance,
      billedBy,
      isReturn,
    });

    foundCustomer.outstandingAmount = newBalance;
    if (paid) {
      foundCustomer.lastPaidOn = new Date();
    }
    foundCustomer.lastBilledOn = new Date();
    await foundCustomer.save();
    await newOrder.save();

    res.status(201).json({ message: "Order created successfully", newOrder });
  } catch (error) {
    console.error("Internal Server error", error);
    res.status(500).json({ message: "Could not create order" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const orderToBeDeleted = await Order.findById(id);
    if (!orderToBeDeleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    const customer = await Customer.findById(orderToBeDeleted.customer);
    if (!customer) {
      return res.status(404).json({ message: "Associated customer not found" });
    }

    // Reverse the outstanding amount

    customer.outstandingAmount = orderToBeDeleted.isReturn
      ? customer.outstandingAmount + orderToBeDeleted.bill
      : customer.outstandingAmount - orderToBeDeleted.bill;

    await customer.save();

    await orderToBeDeleted.deleteOne(); // This preserves the returned data

    res.status(200).json({
      message: "Order deleted successfully",
      deletedOrder: orderToBeDeleted,
    });
  } catch (error) {
    console.error("Could not delete order:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { singleDate, startDate, endDate, customer, isReturn, billedBy } =
      req.query;

    const query = {};

    // 🗓️ Date filtering
    if (singleDate) {
      const userDate = new Date(singleDate);
      const start = new Date(userDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(userDate);
      end.setHours(23, 59, 59, 999);

      query.date = { $gte: start, $lte: end };
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.date.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // 🧍‍♂️ Customer filter
    if (customer) {
      query.customer = customer;
    }

    // 🔁 isReturn (as string from query)
    if (typeof isReturn !== "undefined") {
      query.isReturn = isReturn === "true";
    }

    // 🧾 billedBy
    if (billedBy) {
      query.billedBy = billedBy;
    }

    const orders = await Order.find(query)
      .populate("customer", "name")
      .populate("products.product");

    res.status(200).json({ message: "Success", orders });
  } catch (error) {
    console.error("Couldn't get orders", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createOrder, deleteOrder, getAllOrders };
