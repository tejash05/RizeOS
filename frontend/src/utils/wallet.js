// frontend/src/utils/wallet.js

export async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      localStorage.setItem("walletAddress", address); // ✅ Store address for session use
      return { success: true, address };
    } catch (error) {
      console.warn("🛑 Wallet connection rejected by user.");
      return { success: false, error: "User rejected wallet connection." };
    }
  } else {
    console.error("🦊 MetaMask not detected.");
    return { success: false, error: "MetaMask not detected." };
  }
}
