import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";

export interface FinancialRecord {
  _id?: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

// 👇 Updated: omit userId from input
type FinancialRecordInput = Omit<FinancialRecord, "userId">;

interface FinancialRecordsContextType {
  records: FinancialRecord[];
  addRecord: (record: FinancialRecordInput) => void;
  updateRecord: (id: string, newRecord: FinancialRecord) => void;
  deleteRecord: (id: string) => void;
}

export const FinancialRecordsContext = createContext<
  FinancialRecordsContextType | undefined
>(undefined);

export const FinancialRecordsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const { user } = useUser();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchRecords = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/financial-records/getAllByUserID/${user.id}`
      );
      if (response.ok) {
        const records = await response.json();
        setRecords(records);
      } else {
        console.error("Failed to fetch records");
      }
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const addRecord = async (record: FinancialRecordInput) => {
    if (!user) return;

    const recordWithUserId: FinancialRecord = {
      ...record,
      userId: user.id,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/financial-records`, {
        method: "POST",
        body: JSON.stringify(recordWithUserId),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) => [...prev, newRecord]);
      } else {
        console.error("Failed to add record");
      }
    } catch (err) {
      console.error("Error adding record:", err);
    }
  };

  const updateRecord = async (id: string, newRecord: FinancialRecord) => {
    try {
      const response = await fetch(`${API_BASE_URL}/financial-records/${id}`, {
        method: "PUT",
        body: JSON.stringify(newRecord),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const updatedRecord = await response.json();
        setRecords((prev) =>
          prev.map((record) => (record._id === id ? updatedRecord : record))
        );
      } else {
        console.error("Failed to update record");
      }
    } catch (err) {
      console.error("Error updating record:", err);
    }
  };

  const deleteRecord = async (id: string) => {
    setRecords((prev) => prev.filter((record) => record._id !== id));

    try {
      const response = await fetch(
        `${API_BASE_URL}/financial-records/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        console.error("Failed to delete record from server");
      }
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  return (
    <FinancialRecordsContext.Provider
      value={{ records, addRecord, updateRecord, deleteRecord }}
    >
      {children}
    </FinancialRecordsContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext<FinancialRecordsContextType | undefined>(
    FinancialRecordsContext
  );

  if (!context) {
    throw new Error(
      "useFinancialRecords must be used within a FinancialRecordsProvider"
    );
  }

  return context;
};
