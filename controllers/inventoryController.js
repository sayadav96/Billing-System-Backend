const Inventory = require("../models/Inventory");

const createInventory = async (req, res) => {
  try {
    // const {date, items} = req.body;
    const created = new Inventory(req.body);
    await created.save();
    res.status(201).json({ message: "Inventory successfully added", created });
  } catch (error) {
    console.error("error adding inventory", error);
    res.status(500).json({ message: "internal server error" });
  }
};

const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Inventory.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    res
      .status(200)
      .json({ message: "Inventory updated successfully", updated });
  } catch (error) {
    console.error("updating Inventory failed", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { createInventory, updateInventory };
