import { useUser } from "@clerk/clerk-react";
import { FinancialRecordForm } from "./financial-record-form";
import { FinancialRecordList } from "./financial-record-list";
import "./financial-record.css";
import { useFinancialRecords } from "../../Contexts/financial-record-context";
import { useMemo } from "react";
import { postData } from "../../lib/api"; // <-- Add this

export const Dashboard = () => {
  const { user } = useUser();
  const { records } = useFinancialRecords();

  const totalMonthly = useMemo(() => {
    let totalAmount = 0;
    records.forEach((record) => {
      totalAmount += record.amount;
    });
    return totalAmount;
  }, [records]);

  // ✅ Example API call to save dummy data
  const handleSave = async () => {
    try {
      const result = await postData("save-expense", { amount: 200 }); // adjust endpoint and data
      console.log("Saved!", result);
    } catch (err) {
      console.error("Error saving:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome {user?.firstName}! Here Are Your Finances:</h1>
      <FinancialRecordForm />
      <div>Total Monthly: ${totalMonthly}</div>
      <FinancialRecordList />

      {/* Example test button */}
      <button onClick={handleSave} style={{ marginTop: "1rem" }}>
        Save Dummy Data
      </button>
    </div>
  );
};
