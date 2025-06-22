const Customer = require("../models/Customer");
const Payment = require("../models/Payment");

const createPayment = async (req, res) => {
  try {
    const { customer, amount, modeOfPayment, paidTo, notes } = req.body;
    if (!customer || !amount || !modeOfPayment) {
      return res.status(400).json({ message: "Mandatory fields are missing" });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const currentCustomer = await Customer.findById(customer);
    if (!currentCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const createdPayment = new Payment({
      customer,
      amount,
      modeOfPayment,
      paidTo: paidTo || "not specified",
      notes: notes || "",
    });

    await createdPayment.save();
    currentCustomer.outstandingAmount -= amount;
    await currentCustomer.save();

    res
      .status(201)
      .json({ message: "Payment added successfully", payment: createdPayment });
  } catch (error) {
    console.error("An error occurred while adding Payment", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Id not provided or invalid" });
    }

    const paymentToDelete = await Payment.findById(id);

    if (!paymentToDelete) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const relatedCustomer = await Customer.findById(paymentToDelete.customer);

    if (!relatedCustomer) {
      return res.status(404).json({ message: "Associated customer not found" });
    }

    // Reverse the effect of the payment
    relatedCustomer.outstandingAmount += paymentToDelete.amount;
    await relatedCustomer.save();

    await paymentToDelete.deleteOne();

    res.status(200).json({
      message: "Payment deleted successfully",
      deletedPayment: paymentToDelete,
    });
  } catch (error) {
    console.error("Error while deleting payment:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const { singleDate, startDate, endDate, customer, modeOfPayment, paidTo } =
      req.query;

    const query = {};

    if (singleDate) {
      const start = new Date(singleDate);
      const end = new Date(singleDate);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);

      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        query.date.$lt = end;
      }
    }

    if (customer) {
      query.customer = customer;
    }

    if (modeOfPayment) {
      query.modeOfPayment = modeOfPayment;
    }

    if (paidTo) {
      query.paidTo = paidTo;
    }

    const payments = await Payment.find(query).populate("customer", "name");

    res.status(200).json({ message: "Success", payments });
  } catch (error) {
    console.error("Error while getting all the payments:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { createPayment, deletePayment, getAllPayments };
