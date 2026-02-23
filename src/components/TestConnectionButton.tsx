"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TestConnectionButtonProps {
  apiKey: string;
  shopifyURL: string;
}

export default function TestConnectionButton({
  apiKey,
  shopifyURL,
}: TestConnectionButtonProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey, shopifyURL }),
      });

      if (response.ok) {
        setStatus("Connection successful! 🎉");
      } else {
        throw new Error(
          "Failed to connect to Shopify. Please check your credentials."
        );
      }
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <Button
        onClick={handleTestConnection}
        className="bg-blue-500 hover:bg-blue-600 text-white"
        disabled={isTesting}
      >
        {isTesting ? "Testing..." : "Test Connection"}
      </Button>
      {status && (
        <p
          className={`mt-2 ${
            status.includes("successful") ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
}
