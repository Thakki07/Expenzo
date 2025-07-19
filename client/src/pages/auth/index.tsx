import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import "./Auth.css"; // <-- we'll define styles here

export const Auth = () => {
  return (
    <div className="sign-in-container">
      <SignedOut>
        <div className="auth-box">
          <h1>Welcome to Your Own Personal Finance Tracker!</h1>
          <div className="auth-buttons">
            <SignUpButton mode="modal">
              <button className="auth-btn">Sign Up</button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="auth-btn">Sign In</button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <Navigate to="/" />
      </SignedIn>
    </div>
  );
};
