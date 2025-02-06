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
    const LOTTERY_ABI = [{"inputs":[{"internalType":"contract IERC20","name":"_frollToken","type":"address"},{"internalType":"contract IBSCBlockhash","name":"_bscBlockhash","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256[6]","name":"jackpotNumbers","type":"uint256[6]"},{"indexed":false,"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"name":"JackpotDrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256[6]","name":"numbers","type":"uint256[6]"}],"name":"TicketPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"prize","type":"uint256"}],"name":"WinnerFound","type":"event"},{"inputs":[],"name":"bscBlockhash","outputs":[{"internalType":"contract IBSCBlockhash","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[6][]","name":"ticketSets","type":"uint256[6][]"}],"name":"buyTicket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"drawJackpot","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"frollToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"jackpotHistory","outputs":[{"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDrawTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"participants","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ticketPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"winners","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]; // Dán ABI hợp đồng Mega Millions ở đây

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
// Hiển thị vé số
function createTickets() {
    ticketsContainer.innerHTML = "";
    for (let i = 0; i < 10; i++) {
        const ticketDiv = document.createElement("div");
        ticketDiv.classList.add("ticket");
        ticketDiv.dataset.index = i;
        ticketDiv.innerHTML = `
            <p>Ticket ${i + 1}</p>
            <div class="numbers"></div>
            <button class="quickPick">Quick</button>
        `;
        ticketsContainer.appendChild(ticketDiv);
    }
}
createTickets(); // Tạo vé khi trang tải

// Chọn số ngẫu nhiên cho vé
function generateRandomNumbers() {
    let numbers = new Set();
    while (numbers.size < 5) {
        numbers.add(Math.floor(Math.random() * 70) + 1);
    }
    let megaBall = Math.floor(Math.random() * 25) + 1;
    return [...numbers, megaBall];
}

// Xử lý chọn nhanh từng vé
ticketsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("quickPick")) {
        const ticketDiv = event.target.parentElement;
        const numbersDiv = ticketDiv.querySelector(".numbers");
        const randomNumbers = generateRandomNumbers();
        numbersDiv.textContent = randomNumbers.join(" - ");
        ticketDiv.dataset.numbers = JSON.stringify(randomNumbers);
    }
});

// Chọn nhanh tất cả vé
quickAllButton.addEventListener("click", () => {
    document.querySelectorAll(".quickPick").forEach(button => button.click());
});

// Gửi giao dịch mua vé
buyTicketsButton.addEventListener("click", async () => {
    if (!userAddress || !lotteryContract) {
        alert("Please connect your wallet first.");
        return;
    }

    let selectedTickets = [];
    document.querySelectorAll(".ticket").forEach(ticket => {
        if (ticket.dataset.numbers) {
            selectedTickets.push(JSON.parse(ticket.dataset.numbers));
        }
    });

    if (selectedTickets.length === 0) {
        alert("Please select at least one ticket.");
        return;
    }

    try {
        // Kiểm tra Allowance
        const allowance = await frollToken.allowance(userAddress, LOTTERY_ADDRESS);
        const totalCost = ethers.utils.parseUnits((selectedTickets.length * 0.0001).toString(), 18);
        
        if (allowance.lt(totalCost)) {
            let approveTx = await frollToken.approve(LOTTERY_ADDRESS, totalCost);
            await approveTx.wait();
        }

        // Gửi giao dịch mua vé
        let tx = await lotteryContract.buyTicket(selectedTickets);
        await tx.wait();
        alert("Tickets purchased successfully!");

        // Cập nhật số dư sau khi mua vé
        updateBalances();
    } catch (error) {
        console.error("Transaction failed:", error);
        alert("Transaction failed. Please try again.");
    }
});
const latestDraw = document.getElementById("latestDraw");
const searchDate = document.getElementById("searchDate");
const searchResultButton = document.getElementById("searchResult");
const searchOutput = document.getElementById("searchOutput");

// Hiển thị kết quả kỳ gần nhất
async function getLatestResult() {
    try {
        const lastTimestamp = await lotteryContract.lastDrawTimestamp();
        if (lastTimestamp.toNumber() === 0) {
            latestDraw.textContent = "No results available yet.";
            return;
        }

        const jackpotData = await lotteryContract.jackpotHistory(lastTimestamp);
        const blockHash = jackpotData.blockHash;
        const jackpotNumbers = await generateJackpotNumbers(blockHash);

        latestDraw.textContent = `Latest Draw: ${jackpotNumbers.join(" - ")}`;
    } catch (error) {
        console.error("Error fetching latest result:", error);
        latestDraw.textContent = "Error fetching results.";
    }
}

// Tạo số trúng thưởng từ block hash
async function generateJackpotNumbers(blockHash) {
    let seed = ethers.BigNumber.from(blockHash);
    let numbers = [];
    let usedNumbers = new Set();

    // Lấy 5 số từ 1-70 (không trùng)
    while (numbers.length < 5) {
        let num = seed.mod(70).toNumber() + 1;
        if (!usedNumbers.has(num)) {
            numbers.push(num);
            usedNumbers.add(num);
        }
        seed = seed.div(70);
    }

    // Lấy số Mega Ball từ 1-25
    let megaBall = seed.mod(25).toNumber() + 1;
    numbers.push(megaBall);

    return numbers;
}

// Tra cứu kết quả theo ngày
searchResultButton.addEventListener("click", async () => {
    if (!searchDate.value) {
        alert("Please select a date.");
        return;
    }

    try {
        const timestamp = new Date(searchDate.value).getTime() / 1000;
        const jackpotData = await lotteryContract.jackpotHistory(timestamp);

        if (jackpotData.blockHash === ethers.constants.HashZero) {
            searchOutput.textContent = "No draw on this date.";
            return;
        }

        const jackpotNumbers = await generateJackpotNumbers(jackpotData.blockHash);
        searchOutput.textContent = `Result on ${searchDate.value}: ${jackpotNumbers.join(" - ")}`;
    } catch (error) {
        console.error("Error fetching result:", error);
        searchOutput.textContent = "Error fetching results.";
    }
});

// Gọi ngay khi trang tải
getLatestResult();
