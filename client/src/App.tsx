import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Auth } from "./pages/auth";
import { FinancialRecordsProvider } from "./Contexts/financial-record-context";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="navbar">
          <div className="navbar-left">
            <img src="/expenzo-img.png" alt="Loalago" className="navbar-logo" />
          </div>
          <div className="navbar-right">
            <Link to="/">Dashboard</Link>
            <SignedIn>
              <UserButton appearance={{ baseTheme: dark }} />
            </SignedIn>
          </div>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <FinancialRecordsProvider>
                <Dashboard />
              </FinancialRecordsProvider>
            }
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
