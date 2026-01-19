import { Payment } from "../models/payment.model.js";

// Initiate a payment
export const initiatePayment = async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount ) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const payment = new Payment({
      userId,
      amount
    });

    await payment.save();

    // Here, you would interact with the payment gateway's SDK or API.
    // Example: Generate a payment link or transaction ID.

    res.status(201).json({
      message: 'Payment initiated.',
      paymentId: payment._id,
      transactionId: payment.transactionId || 'TRANSACTION_ID_FROM_GATEWAY',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to initiate payment.', error });
  }
};

// Verify a payment
export const verifyPayment = async (req, res) => {
  const { paymentId, transactionId, status } = req.body;

  if (!paymentId || !transactionId || !status) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found.' });
    }

    payment.transactionId = transactionId;
    payment.status = status;

    await payment.save();

    res.status(200).json({ message: 'Payment verified.', payment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify payment.', error });
  }
};

// Get payment details
export const getPaymentDetails = async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found.' });
    }

    res.status(200).json({ payment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve payment details.', error });
  }
};
