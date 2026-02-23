"use client"; // This ensures the component is a client component

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordVerificationProps {
  onAuthenticate: () => void;
}

const PasswordVerification: React.FC<PasswordVerificationProps> = ({
  onAuthenticate,
}) => {
  const [password, setPassword] = useState("");

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/verify-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const result = await response.json();
    if (result.success) {
      onAuthenticate();
    } else {
      alert("Incorrect password!");
    }
  };

  return (
    <form
      onSubmit={handlePasswordSubmit}
      className="flex flex-col gap-6 items-center sm:items-start"
    >
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter Password"
        className="w-full"
      />
      <Button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 mt-4"
      >
        Submit
      </Button>
    </form>
  );
};

export default PasswordVerification;
