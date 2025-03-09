import { WalletBuilder } from "@midnight-ntwrk/wallet/dist/main.js";
import { NetworkId, nativeToken } from "@midnight-ntwrk/zswap";
import express from "express";
import cors from "cors"; // Import the cors package

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post("/api/submit-wallet", async (req, res) => {
  const { walletId } = req.body;

  if (!walletId) {
    return res.status(400).json({ error: "Wallet ID is required" });
  }

  console.log("Received wallet ID:", walletId);

  try {
    const wallet = await WalletBuilder.build(
      "https://indexer.testnet-02.midnight.network/api/v1/graphql",
      "wss://indexer.testnet-02.midnight.network/api/v1/graphql",
      "http://localhost:6300",
      "https://rpc.testnet-02.midnight.network",
      NetworkId.TestNet
    );

    wallet.start();
    const token = nativeToken();
    console.log("Token Type:", token);

    const transferRecipe = await wallet.transferTransaction([
      {
        amount: 1n,
        tokenType: nativeToken(), // tDUST token type
        walletId
      },
    ]);

    const provenTransaction = await wallet.proveTransaction(transferRecipe);
    const submittedTransaction = await wallet.submitTransaction(
      provenTransaction
    );

    console.log("Transaction submitted", submittedTransaction);

    res
      .status(200)
      .json({ message: "Wallet ID received successfully", walletId });
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the wallet ID." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
