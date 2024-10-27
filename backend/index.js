const express = require("express");
const { ReclaimProofRequest } = require("@reclaimprotocol/js-sdk");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = 5001;

app.use(express.json());

// Route to generate SDK configuration
app.get("/reclaim/github/generate-config", async (req, res) => {
  const APP_ID = process.env.APP_ID;
  const APP_SECRET = process.env.APP_SECRET;
  const PROVIDER_ID = "8573efb4-4529-47d3-80da-eaa7384dac19";

  try {
    const reclaimProofRequest = await ReclaimProofRequest.init(
      APP_ID,
      APP_SECRET,
      PROVIDER_ID
    );

    reclaimProofRequest.setAppCallbackUrl(
      "https://your-backend.com/receive-proofs"
    );

    const reclaimProofRequestConfig = reclaimProofRequest.toJsonString();

    return res.json({ reclaimProofRequestConfig });
  } catch (error) {
    console.error("Error generating request config:", error);
    return res.status(500).json({ error: "Failed to generate request config" });
  }
});

// Route to generate SDK configuration
app.get("/reclaim/linkedin/generate-config", async (req, res) => {
  const APP_ID = process.env.APP_ID;
  const APP_SECRET = process.env.APP_SECRET;
  const PROVIDER_ID = "19cbec34-8c90-495d-800a-a87654f0457a";

  try {
    const reclaimProofRequest = await ReclaimProofRequest.init(
      APP_ID,
      APP_SECRET,
      PROVIDER_ID
    );

    reclaimProofRequest.setAppCallbackUrl(
      "https://your-backend.com/receive-proofs"
    );

    const reclaimProofRequestConfig = reclaimProofRequest.toJsonString();

    return res.json({ reclaimProofRequestConfig });
  } catch (error) {
    console.error("Error generating request config:", error);
    return res.status(500).json({ error: "Failed to generate request config" });
  }
});

// Route to receive proofs
app.post("/receive-proofs", (req, res) => {
  const proofs = req.body;
  console.log("Received proofs:", proofs);
  // Process the proofs here
  return res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
