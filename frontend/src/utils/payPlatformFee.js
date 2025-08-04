import { ethers } from "ethers";

export async function payPlatformFee() {
  try {
    if (!window.ethereum) {
      alert("MetaMask not found.");
      return null;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const walletAddress = await signer.getAddress();

    const adminWallet = "0x2bD6A067FAb5603d38c995f1807C92fD836f0336"; // your wallet
    const amount = "0.001"; // ETH

    const tx = await signer.sendTransaction({
      to: adminWallet,
      value: ethers.parseEther(amount),
    });

    console.log("💸 Tx sent:", tx);
    await tx.wait();
    console.log("✅ Confirmed:", tx.hash);

    return {
      txHash: tx.hash,
      wallet: walletAddress,
      amount: parseFloat(amount),
    };
  } catch (err) {
    console.error("❌ Payment failed:", err);
    alert("Payment failed or cancelled.");
    return null;
  }
}
