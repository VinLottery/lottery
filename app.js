document.addEventListener("DOMContentLoaded", async () => {
    const walletButton = document.getElementById("connectWallet");
    const walletAddress = document.getElementById("walletAddress");
    const ticketsContainer = document.getElementById("ticketsContainer");
    const quickAllButton = document.getElementById("quickAll");
    const buyTicketsButton = document.getElementById("buyTickets");

    let userAddress = null;
    let provider, signer, frollToken, lotteryContract;

    // Địa chỉ hợp đồng trên BSC
    const FROLL_ADDRESS = "0x7783cBC17d43F936DA1C1D052E4a33a9FfF774c1";
    const LOTTERY_ADDRESS = "0x28ba1dE00bF69B7acE03364eEA1E34F86Cde2944";

    // ABI hợp đồng
    const FROLL_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]; // Dán ABI token FROLL ở đây
    const LOTTERY_ABI = [...]; // Dán ABI hợp đồng Mega Millions ở đây

    // Kết nối ví
    walletButton.addEventListener("click", async () => {
        if (window.ethereum) {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            userAddress = await signer.getAddress();
            walletAddress.textContent = `Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;

            // Khởi tạo hợp đồng
            frollToken = new ethers.Contract(FROLL_ADDRESS, FROLL_ABI, signer);
            lotteryContract = new ethers.Contract(LOTTERY_ADDRESS, LOTTERY_ABI, signer);

            // Lấy số dư
            updateBalances();
        } else {
            alert("Please install MetaMask to connect your wallet.");
        }
    });

    // Cập nhật số dư FROLL & BNB
    async function updateBalances() {
        if (!userAddress) return;

        const balanceBNB = await provider.getBalance(userAddress);
        const balanceFROLL = await frollToken.balanceOf(userAddress);

        walletAddress.textContent = `Wallet: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}
            | BNB: ${ethers.utils.formatEther(balanceBNB)} | FROLL: ${ethers.utils.formatUnits(balanceFROLL, 18)}`;
    }
});
