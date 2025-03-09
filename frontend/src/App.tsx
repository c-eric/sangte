import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const App = () => {
  const [walletId, setWalletId] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/submit-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletId }),
      });
      const data = await response.json();
      console.log("Response:", data);
    } catch (error) {
      console.error("Error submitting wallet ID:", error);
    }
  };

  return (
    <>
      {" "}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="scroll-m-20 text-4xl mb-6 font-extrabold tracking-tight lg:text-5xl">
          SANGTÉ
        </h1>
        <Card className="w-full max-w-2xl p-6 shadow-xl">
          <CardContent>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Donator Wallet ID
            </label>
            <Input
              type="text"
              placeholder="Enter wallet ID..."
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className="w-full p-3 text-lg border rounded-xl focus:ring focus:ring-blue-300"
            />
            <Button
              onClick={handleSubmit}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600"
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default App;
