document.addEventListener("DOMContentLoaded", async () => {
    // DOM Elements
    const walletButton = document.getElementById("connectWallet");
    const walletAddressDisplay = document.getElementById("walletAddress");
    const frollBalanceDisplay = document.getElementById("frollBalance");
    const bnbBalanceDisplay = document.getElementById("bnbBalance");
    const jackpotAmount = document.getElementById("jackpot-amount");

    // Địa chỉ hợp đồng trên BSC
    const FROLL_ADDRESS = "0x7783cBC17d43F936DA1C1D052E4a33a9FfF774c1";
    const LOTTERY_ADDRESS = "0x28ba1dE00bF69B7acE03364eEA1E34F86Cde2944";

    // ABI hợp đồng
    const FROLL_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"}]; // Dán ABI token FROLL ở đây
    const LOTTERY_ABI = [{"inputs":[{"internalType":"contract IERC20","name":"_frollToken","type":"address"},{"internalType":"contract IBSCBlockhash","name":"_bscBlockhash","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256[6][]","name":"ticketSets","type":"uint256[6][]"}],"name":"buyTicket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"ticketPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]; // Dán ABI hợp đồng Mega Millions ở đây

    let provider, signer, frollToken, lotteryContract, userAddress;

    // Kết nối ví MetaMask
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

                // Lấy số dư
                fetchWalletBalance();
                fetchJackpotBalance();
            } catch (error) {
                console.error("Wallet connection failed:", error);
            }
        } else {
            alert("MetaMask is not installed. Please install it to use this feature.");
        }
    }

    // Lấy số dư BNB & FROLL trong ví
    async function fetchWalletBalance() {
        try {
            const bnbBalance = await provider.getBalance(userAddress);
            bnbBalanceDisplay.textContent = `${ethers.utils.formatEther(bnbBalance)} BNB`;

            const frollBalance = await frollToken.balanceOf(userAddress);
            frollBalanceDisplay.textContent = `${ethers.utils.formatUnits(frollBalance, 18)} FROLL`;
        } catch (error) {
            console.error("Failed to fetch wallet balance:", error);
        }
    }

    // Lấy số dư jackpot từ hợp đồng xổ số
    async function fetchJackpotBalance() {
        if (!lotteryContract) return;
        try {
            const balance = await frollToken.balanceOf(LOTTERY_ADDRESS);
            jackpotAmount.textContent = `${ethers.utils.formatUnits(balance, 18)} FROLL`;
        } catch (error) {
            console.error("Failed to fetch jackpot balance:", error);
            jackpotAmount.textContent = "Error loading jackpot.";
        }
    }

    // Event Listeners
    walletButton.addEventListener("click", connectWallet);
});

// DOM Elements
const playButton = document.getElementById("play-button");
const ticketsContainer = document.getElementById("ticketsContainer");
const quickAllButton = document.getElementById("quickAll");

playButton.addEventListener("click", () => {
    ticketsContainer.innerHTML = ""; // Xóa vé cũ
    for (let i = 0; i < 10; i++) {
        createTicket(i); // Tạo vé số
    }
});

// Tạo một vé số
function createTicket(ticketIndex) {
    const ticketDiv = document.createElement("div");
    ticketDiv.classList.add("ticket");

    // Tạo lưới số từ 1-70
    const numberGrid70 = document.createElement("div");
    numberGrid70.classList.add("number-grid-top");
    for (let i = 1; i <= 70; i++) {
        let btn = createNumberButton(i, ticketIndex, 70);
        numberGrid70.appendChild(btn);
    }

    // Tạo lưới số từ 1-25 (Powerball)
    const numberGrid25 = document.createElement("div");
    numberGrid25.classList.add("number-grid-bottom");
    for (let i = 1; i <= 25; i++) {
        let btn = createNumberButton(i, ticketIndex, 25);
        numberGrid25.appendChild(btn);
    }

    // Nút "Quick" để chọn nhanh vé
    const quickButton = document.createElement("button");
    quickButton.textContent = "Quick";
    quickButton.classList.add("quick-buttons");
    quickButton.addEventListener("click", () => quickPick(ticketIndex)); // Chọn nhanh cho vé

    // Thêm tất cả vào vé
    ticketDiv.appendChild(numberGrid70);
    ticketDiv.appendChild(numberGrid25);
    ticketDiv.appendChild(quickButton);
    ticketsContainer.appendChild(ticketDiv);
}

// Tạo nút số trong bảng chọn
function createNumberButton(number, ticketIndex, max) {
    const btn = document.createElement("button");
    btn.textContent = number;
    btn.dataset.ticket = ticketIndex;
    btn.dataset.value = number;
    btn.dataset.max = max;
    btn.addEventListener("click", () => selectNumber(btn, ticketIndex));
    return btn;
}

// Xử lý chọn số
function selectNumber(button, ticketIndex) {
    let selectedNumbers = document.querySelectorAll(`button.selected[data-ticket='${ticketIndex}'][data-max='70']`);
    let powerNumber = document.querySelectorAll(`button.selected[data-ticket='${ticketIndex}'][data-max='25']`);

    if (button.dataset.max === "70" && selectedNumbers.length >= 5 && !button.classList.contains("selected")) {
        alert("You can only select 5 numbers from 1-70.");
        return;
    }

    if (button.dataset.max === "25" && powerNumber.length >= 1 && !button.classList.contains("selected")) {
        alert("You can only select 1 Powerball number.");
        return;
    }

    button.classList.toggle("selected");
}

// Chọn nhanh vé tự động
function quickPick(ticketIndex) {
    let numbers70 = [];
    let numbers25 = [];

    // Chọn 5 số ngẫu nhiên từ 1-70
    while (numbers70.length < 5) {
        let randomNum = Math.floor(Math.random() * 70) + 1;
        if (!numbers70.includes(randomNum)) numbers70.push(randomNum);
    }

    // Chọn 1 số Powerball từ 1-25
    numbers25.push(Math.floor(Math.random() * 25) + 1);

    let buttons = document.querySelectorAll(`button[data-ticket='${ticketIndex}']`);
    buttons.forEach(btn => {
        let num = parseInt(btn.dataset.value);
        if (numbers70.includes(num) || numbers25.includes(num)) {
            btn.classList.add("selected");
        } else {
            btn.classList.remove("selected");
        }
    });
}

// Chọn nhanh tất cả vé
quickAllButton.addEventListener("click", () => {
    for (let i = 0; i < 10; i++) {
        quickPick(i);
    }
});

// Elements
const buyTicketsButton = document.getElementById("buyTickets");
const transactionStatus = document.getElementById("transaction-status");

// Xử lý mua vé
buyTicketsButton.addEventListener("click", async () => {
    if (!userAddress) {
        alert("Please connect your wallet first.");
        return;
    }

    // Lấy danh sách vé đã chọn
    let tickets = [];
    for (let i = 0; i < 10; i++) {
        let selectedNumbers = [...document.querySelectorAll(`button.selected[data-ticket='${i}'][data-max='70']`)].map(btn => parseInt(btn.dataset.value));
        let powerNumber = [...document.querySelectorAll(`button.selected[data-ticket='${i}'][data-max='25']`)].map(btn => parseInt(btn.dataset.value));

        if (selectedNumbers.length === 5 && powerNumber.length === 1) {
            tickets.push([...selectedNumbers.sort((a, b) => a - b), ...powerNumber]);  // Sắp xếp các số trước khi lưu vào blockchain
        }
    }

    if (tickets.length < 1) {
        alert("You must select at least 1 ticket.");
        return;
    }

    try {
        // Kiểm tra số dư FROLL
        const ticketPrice = await lotteryContract.ticketPrice();
        const totalCost = ticketPrice.mul(tickets.length);
        const userBalance = await frollToken.balanceOf(userAddress);

        if (userBalance.lt(totalCost)) {
            alert("Insufficient FROLL balance.");
            return;
        }

        // Approve FROLL spending
        const allowance = await frollToken.allowance(userAddress, LOTTERY_ADDRESS);
        if (allowance.lt(totalCost)) {
            const approveTx = await frollToken.approve(LOTTERY_ADDRESS, totalCost);
            transactionStatus.textContent = "Approving FROLL...";
            await approveTx.wait();
        }

        // Gửi giao dịch mua vé
        const buyTx = await lotteryContract.buyTicket(tickets);
        transactionStatus.textContent = "Transaction pending...";
        await buyTx.wait();

        transactionStatus.textContent = "Tickets purchased successfully!";
        console.log("Transaction Hash:", buyTx.hash);

        alert(`Tickets purchased successfully! Check transaction on BSCScan:\nhttps://bscscan.com/tx/${buyTx.hash}`);

    } catch (error) {
        console.error("Transaction failed:", error);
        transactionStatus.textContent = "Transaction failed!";
    }
});

// Fetch Latest Jackpot Result
async function fetchLatestJackpot() {
    if (!lotteryContract) return;

    try {
        const lastTimestamp = await lotteryContract.lastDrawTimestamp();
        if (lastTimestamp.toNumber() === 0) {
            document.getElementById("jackpot-numbers").textContent = "No jackpot results yet.";
            return;
        }

        const result = await lotteryContract.jackpotHistory(lastTimestamp);
        const blockHash = result.blockHash;
        const numbers = await parseJackpotNumbers(blockHash);

        document.getElementById("jackpot-numbers").textContent = numbers.join(" - ");
        document.getElementById("jackpot-date").textContent = `Drawn on: ${new Date(lastTimestamp.toNumber() * 1000).toLocaleDateString()}`;
    } catch (error) {
        console.error("Failed to fetch jackpot:", error);
        document.getElementById("jackpot-numbers").textContent = "Error loading jackpot.";
    }
}

// Chuyển đổi block hash thành số trúng thưởng
async function parseJackpotNumbers(blockHash) {
    let seed = BigInt(blockHash);
    let numbers = [];

    for (let i = 0; i < 5; i++) {
        numbers.push(Number(seed % 70n) + 1);
        seed /= 70n;
    }
    numbers.push(Number(seed % 25n) + 1); // Powerball số cuối

    return numbers;
}

// Countdown to Next Draw
async function startCountdown() {
    if (!lotteryContract) return;

    try {
        const lastTimestamp = await lotteryContract.lastDrawTimestamp();
        let nextDrawTime = lastTimestamp.toNumber() + 86400; // Quay số tiếp theo vào 00:00 UTC

        function updateCountdown() {
            let now = Math.floor(Date.now() / 1000);
            let timeLeft = nextDrawTime - now;

            if (timeLeft <= 0) {
                document.getElementById("countdownTimer").textContent = "Drawing soon...";
                clearInterval(countdownInterval);
                fetchLatestJackpot(); // Cập nhật kết quả Jackpot
                startCountdown(); // Khởi động lại đếm ngược
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

// Load Jackpot & Countdown khi trang mở
window.addEventListener("load", () => {
    fetchLatestJackpot();
    startCountdown();
});
