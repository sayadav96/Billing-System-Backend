const Customer = require("../models/Customer");

const createCustomer = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      defaultProducts,
      outstandingAmount,
      lastPaidOn,
      lastBilledOn,
      notes,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    if (
      defaultProducts &&
      (!Array.isArray(defaultProducts) ||
        defaultProducts.some((p) => !p.product || p.customPrice === undefined))
    ) {
      return res.status(400).json({
        message: "Each default product must include product ID and customPrice",
      });
    }

    const customer = new Customer({
      name,
      phone,
      address,
      defaultProducts,
      outstandingAmount,
      lastPaidOn,
      lastBilledOn,
      notes,
    });

    await customer.save();

    res
      .status(201)
      .json({ message: "New customer created successfully", customer });
  } catch (error) {
    console.error("Error creating the customer", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log("id", id);
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // ✅ Step 1: Merge defaultProducts if provided
    if (Array.isArray(updates.defaultProducts)) {
      const newOrUpdated = [];

      for (const incoming of updates.defaultProducts) {
        const index = customer.defaultProducts.findIndex(
          (p) => String(p.product) === String(incoming.product)
        );

        if (index > -1) {
          // Update existing price
          customer.defaultProducts[index].customPrice = incoming.customPrice;
        } else {
          // Add new product
          newOrUpdated.push(incoming);
        }
      }

      if (newOrUpdated.length > 0) {
        customer.defaultProducts.push(...newOrUpdated);
      }

      delete updates.defaultProducts;
    }

    const updatableFields = [
      "name",
      "phone",
      "address",
      "outstandingAmount",
      "lastPaidOn",
      "lastBilledOn",
      "isActive",
      "notes",
    ];

    updatableFields.forEach((field) => {
      if (updates[field] !== undefined) {
        customer[field] = updates[field];
      }
    });

    await customer.save();

    res
      .status(200)
      .json({ message: "Customer update successful", updated: customer });
  } catch (error) {
    console.error("❌ Error updating customer:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({ message: "success", customers });
  } catch (error) {
    console.error("Could not get all the customers", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createCustomer, updateCustomer, getAllCustomers };
