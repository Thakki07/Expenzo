import express, { Request, Response, RequestHandler } from "express";
import FinancialRecordModel from "../schema/financial-record";

const router = express.Router();

interface FinancialRecord {
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

const getAllByUserID: RequestHandler = async (req, res): Promise<void> => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const records = await FinancialRecordModel.find({ userId: userId });
    if (records.length === 0) {
      res.status(404).json({ message: "No records found for the user." });
      return;
    }
    res.status(200).json(records);
  } catch (err) {
    console.error("Error in getAllByUserID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createRecord: RequestHandler = async (req, res): Promise<void> => {
  try {
    const newRecordBody = req.body;
    if (!newRecordBody || Object.keys(newRecordBody).length === 0) {
      res.status(400).json({ error: "Request body is required" });
      return;
    }

    const newRecord = new FinancialRecordModel(newRecordBody);
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (err) {
    console.error("Error in createRecord:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateRecord: RequestHandler = async (req, res): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: "Record ID is required" });
      return;
    }

    const newRecordBody = req.body;
    if (!newRecordBody || Object.keys(newRecordBody).length === 0) {
      res.status(400).json({ error: "Request body is required" });
      return;
    }

    const record = await FinancialRecordModel.findByIdAndUpdate(
      id,
      newRecordBody,
      { new: true }
    );

    if (!record) {
      res.status(404).json({ error: "Record not found" });
      return;
    }

    res.status(200).json(record);
  } catch (err) {
    console.error("Error in updateRecord:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteRecord: RequestHandler = async (req, res): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: "Record ID is required" });
      return;
    }

    const record = await FinancialRecordModel.findByIdAndDelete(id);
    if (!record) {
      res.status(404).json({ error: "Record not found" });
      return;
    }
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (err) {
    console.error("Error in deleteRecord:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

router.get("/getAllByUserID/:userId", getAllByUserID);
router.post("/", createRecord);
router.put("/:id", updateRecord);
router.delete("/:id", deleteRecord);

export default router;