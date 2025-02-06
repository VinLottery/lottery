document.addEventListener("DOMContentLoaded", async () => {
    // DOM Elements
    const walletButton = document.getElementById("connect-wallet");
    const walletAddressDisplay = document.getElementById("wallet-address");
    
    // Địa chỉ hợp đồng trên BSC
    const FROLL_ADDRESS = "0x7783cBC17d43F936DA1C1D052E4a33a9FfF774c1";
    const LOTTERY_ADDRESS = "0x28ba1dE00bF69B7acE03364eEA1E34F86Cde2944";

    // ABI hợp đồng
    const FROLL_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]; // Dán ABI token FROLL ở đây
    const LOTTERY_ABI = [{"inputs":[{"internalType":"contract IERC20","name":"_frollToken","type":"address"},{"internalType":"contract IBSCBlockhash","name":"_bscBlockhash","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256[6]","name":"jackpotNumbers","type":"uint256[6]"},{"indexed":false,"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"name":"JackpotDrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256[6]","name":"numbers","type":"uint256[6]"}],"name":"TicketPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"prize","type":"uint256"}],"name":"WinnerFound","type":"event"},{"inputs":[],"name":"bscBlockhash","outputs":[{"internalType":"contract IBSCBlockhash","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[6][]","name":"ticketSets","type":"uint256[6][]"}],"name":"buyTicket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"drawJackpot","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"frollToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"jackpotHistory","outputs":[{"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDrawTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"participants","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ticketPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"winners","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]; // Dán ABI hợp đồng Mega Millions ở đây
let provider, signer, frollToken, lotteryContract, userAddress;

    // Connect MetaMask Wallet
    async function connectWallet() {
        if (window.ethereum) {
            try {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                signer = provider.getSigner();
                userAddress = await signer.getAddress();
                walletAddressDisplay.textContent = `Connected: ${userAddress}`;

                // Load Contracts
                frollToken = new ethers.Contract(FROLL_ADDRESS, FROLL_ABI, signer);
                lotteryContract = new ethers.Contract(LOTTERY_ADDRESS, LOTTERY_ABI, signer);

                // Fetch Balances
                fetchBNBBalance();
                fetchFROLLBalance();
            } catch (error) {
                console.error("Wallet connection failed:", error);
            }
        } else {
            alert("MetaMask is not installed. Please install it to use this feature.");
        }
    }

    // Fetch BNB Balance
    async function fetchBNBBalance() {
        const balance = await provider.getBalance(userAddress);
        const formattedBalance = ethers.utils.formatEther(balance);
        console.log(`BNB Balance: ${formattedBalance} BNB`);
    }

    // Fetch FROLL Balance
    async function fetchFROLLBalance() {
        const balance = await frollToken.balanceOf(userAddress);
        const formattedBalance = ethers.utils.formatUnits(balance, 18);
        console.log(`FROLL Balance: ${formattedBalance} FROLL`);
    }

    // Event Listener
    walletButton.addEventListener("click", connectWallet);
});
// Buy Lottery Ticket
const ticketForm = document.getElementById("ticket-form");
const transactionStatus = document.getElementById("transaction-status");

ticketForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!userAddress) {
        alert("Please connect your wallet first.");
        return;
    }

    // Get selected numbers
    const numbers = [
        parseInt(document.getElementById("num1").value),
        parseInt(document.getElementById("num2").value),
        parseInt(document.getElementById("num3").value),
        parseInt(document.getElementById("num4").value),
        parseInt(document.getElementById("num5").value),
        parseInt(document.getElementById("num6").value)
    ];

    // Validate numbers
    if (!validateNumbers(numbers)) {
        alert("Invalid numbers! Select 5 numbers (1-70) + 1 Powerball (1-25).");
        return;
    }

    try {
        // Approve FROLL spending
        const ticketPrice = await lotteryContract.ticketPrice();
        const allowance = await frollToken.allowance(userAddress, LOTTERY_ADDRESS);

        if (allowance.lt(ticketPrice)) {
            const approveTx = await frollToken.approve(LOTTERY_ADDRESS, ticketPrice);
            await approveTx.wait();
        }

        // Buy ticket
        const buyTx = await lotteryContract.buyTicket([[numbers]]);
        transactionStatus.textContent = "Transaction pending...";
        await buyTx.wait();
        transactionStatus.textContent = "Ticket purchased successfully!";
    } catch (error) {
        console.error("Transaction failed:", error);
        transactionStatus.textContent = "Transaction failed!";
    }
});

// Validate numbers (5 from 1-70 + 1 from 1-25)
function validateNumbers(numbers) {
    const numSet = new Set(numbers.slice(0, 5)); // First 5 numbers
    return (
        numbers.length === 6 &&
        numbers.slice(0, 5).every(num => num >= 1 && num <= 70) &&
        numbers[5] >= 1 && numbers[5] <= 25 &&
        numSet.size === 5
    );
}
// Fetch Latest Jackpot Result
async function fetchLatestJackpot() {
    if (!lotteryContract) return;

    try {
        // Get last draw timestamp
        const lastTimestamp = await lotteryContract.lastDrawTimestamp();
        if (lastTimestamp.toNumber() === 0) {
            document.getElementById("jackpot-numbers").textContent = "No jackpot results yet.";
            return;
        }

        // Get jackpot numbers & block hash
        const result = await lotteryContract.jackpotHistory(lastTimestamp);
        const blockHash = result.blockHash;
        const numbers = await parseJackpotNumbers(blockHash);

        // Update UI
        document.getElementById("jackpot-numbers").textContent = numbers.join(" - ");
        document.getElementById("jackpot-date").textContent = `Drawn on: ${new Date(lastTimestamp.toNumber() * 1000).toLocaleDateString()}`;
    } catch (error) {
        console.error("Failed to fetch jackpot:", error);
        document.getElementById("jackpot-numbers").textContent = "Error loading jackpot.";
    }
}

// Parse Jackpot Numbers from Block Hash
async function parseJackpotNumbers(blockHash) {
    // Convert block hash to random numbers
    let seed = BigInt(blockHash);
    let numbers = [];
    for (let i = 0; i < 5; i++) {
        numbers.push(Number(seed % 70n) + 1);
        seed /= 70n;
    }
    numbers.push(Number(seed % 25n) + 1); // Powerball
    return numbers;
}

// Load Jackpot on Page Load
window.addEventListener("load", fetchLatestJackpot);
// Countdown to Next Draw
async function startCountdown() {
    if (!lotteryContract) return;

    try {
        // Get last draw timestamp
        const lastTimestamp = await lotteryContract.lastDrawTimestamp();
        let nextDrawTime = lastTimestamp.toNumber() + 86400; // Next draw at midnight UTC

        function updateCountdown() {
            let now = Math.floor(Date.now() / 1000);
            let timeLeft = nextDrawTime - now;

            if (timeLeft <= 0) {
                document.getElementById("countdownTimer").textContent = "Drawing soon...";
                clearInterval(countdownInterval);
                fetchLatestJackpot(); // Refresh jackpot results
                startCountdown(); // Restart countdown
                return;
            }

            let hours = Math.floor(timeLeft / 3600);
            let minutes = Math.floor((timeLeft % 3600) / 60);
            let seconds = timeLeft % 60;
            document.getElementById("countdownTimer").textContent = `Next Draw: ${hours}h ${minutes}m ${seconds}s`;
        }

        updateCountdown();
        let countdownInterval = setInterval(updateCountdown, 1000);
    } catch (error) {
        console.error("Failed to fetch countdown:", error);
        document.getElementById("countdownTimer").textContent = "Error loading countdown.";
    }
}

// Load Countdown on Page Load
window.addEventListener("load", startCountdown);
