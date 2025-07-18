"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const financial_record_1 = __importDefault(require("../schema/financial-record"));
const router = express_1.default.Router();
const getAllByUserID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!userId) {
            res.status(400).json({ error: "User ID is required" });
            return;
        }
        const records = yield financial_record_1.default.find({ userId: userId });
        if (records.length === 0) {
            res.status(404).json({ message: "No records found for the user." });
            return;
        }
        res.status(200).json(records);
    }
    catch (err) {
        console.error("Error in getAllByUserID:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
const createRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newRecordBody = req.body;
        if (!newRecordBody || Object.keys(newRecordBody).length === 0) {
            res.status(400).json({ error: "Request body is required" });
            return;
        }
        const newRecord = new financial_record_1.default(newRecordBody);
        const savedRecord = yield newRecord.save();
        res.status(201).json(savedRecord);
    }
    catch (err) {
        console.error("Error in createRecord:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
const updateRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const record = yield financial_record_1.default.findByIdAndUpdate(id, newRecordBody, { new: true });
        if (!record) {
            res.status(404).json({ error: "Record not found" });
            return;
        }
        res.status(200).json(record);
    }
    catch (err) {
        console.error("Error in updateRecord:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
const deleteRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ error: "Record ID is required" });
            return;
        }
        const record = yield financial_record_1.default.findByIdAndDelete(id);
        if (!record) {
            res.status(404).json({ error: "Record not found" });
            return;
        }
        res.status(200).json({ message: "Record deleted successfully" });
    }
    catch (err) {
        console.error("Error in deleteRecord:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.get("/getAllByUserID/:userId", getAllByUserID);
router.post("/", createRecord);
router.put("/:id", updateRecord);
router.delete("/:id", deleteRecord);
exports.default = router;
