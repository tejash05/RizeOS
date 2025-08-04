import { ethers } from "ethers";

export async function payPlatformFee() {
  try {
    if (!window.ethereum) {
      alert("MetaMask not found.");
      return { success: false, error: "MetaMask not found" };
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const connectedWallet = await signer.getAddress();

    const expectedWallet = localStorage.getItem("wallet");
    if (
      expectedWallet &&
      connectedWallet.toLowerCase() !== expectedWallet.toLowerCase()
    ) {
      alert(`⚠️ Please switch to your saved wallet: ${expectedWallet}`);
      return { success: false, error: "Wallet mismatch" };
    }

    const adminWallet = "0x2bD6A067FAb5603d38c995f1807C92fD836f0336";
    const amount = "0.001";

    const tx = await signer.sendTransaction({
      to: adminWallet,
      value: ethers.parseEther(amount),
    });

    console.log("💸 Tx sent:", tx);
    await tx.wait();
    console.log("✅ Confirmed:", tx.hash);

    return {
      success: true,
      txHash: tx.hash,
      wallet: connectedWallet,
      amount: parseFloat(amount),
    };
  } catch (err) {
    console.error("❌ Payment failed:", err);
    alert("Payment failed or cancelled.");
    return { success: false, error: err.message || "Unknown error" };
  }
}
