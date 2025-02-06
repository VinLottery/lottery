// Contract Addresses
const lotteryContractAddress = "0x6b7300b552D6384cd4e8a36639625669af868A2C";
const frollTokenAddress = "0x7783cBC17d43F936DA1C1D052E4a33a9FfF774c1";

// ABI của hợp đồng Mega Millions Lottery
const lotteryABI = [{"inputs":[{"internalType":"contract IERC20","name":"_frollToken","type":"address"},{"internalType":"contract IBSCBlockhash","name":"_bscBlockhash","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256[6]","name":"jackpotNumbers","type":"uint256[6]"},{"indexed":false,"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"name":"JackpotDrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"string","name":"ticketFormat","type":"string"}],"name":"TicketsPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"prize","type":"uint256"}],"name":"WinnerFound","type":"event"},{"inputs":[],"name":"bscBlockhash","outputs":[{"internalType":"contract IBSCBlockhash","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[6][]","name":"ticketSets","type":"uint256[6][]"}],"name":"buyTicket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"player","type":"address"},{"internalType":"uint256","name":"drawTimestamp","type":"uint256"}],"name":"checkWinningTicket","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"frollToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"drawTimestamp","type":"uint256"}],"name":"getJackpotResult","outputs":[{"internalType":"uint256[6]","name":"","type":"uint256[6]"},{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"player","type":"address"}],"name":"getUserTickets","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"jackpotHistory","outputs":[{"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDrawTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"participants","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ticketPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ticketsPerPurchase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userTicketFormats","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"winners","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]; // Dán ABI hợp đồng xổ số vào đây
const tokenABI = [...]; // Dán ABI token FROLL vào đây

// Khai báo biến
let provider, signer, userAccount;
let lotteryContract, frollToken;
const ticketsPerPurchase = 3;

// Kết nối ví
async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        userAccount = await signer.getAddress();

        document.getElementById("connectWallet").innerText = `Wallet: ${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
        document.getElementById("connectWallet").style.background = "#27ae60";

        initContracts();
    } else {
        alert("MetaMask not found! Please install MetaMask.");
    }
}

// Khởi tạo hợp đồng
function initContracts() {
    lotteryContract = new ethers.Contract(lotteryContractAddress, lotteryABI, signer);
    frollToken = new ethers.Contract(frollTokenAddress, tokenABI, signer);

    loadJackpotData();
    loadUserTickets();
}

// Lấy dữ liệu Jackpot
async function loadJackpotData() {
    try {
        const jackpotBalance = await frollToken.balanceOf(lotteryContractAddress);
        document.getElementById("jackpotAmount").innerText = `${ethers.utils.formatEther(jackpotBalance)} FROLL`;

        const lastDrawTimestamp = await lotteryContract.lastDrawTimestamp();
        const nextDraw = new Date((lastDrawTimestamp.toNumber() + 86400) * 1000);
        document.getElementById("nextDrawTime").innerText = nextDraw.toUTCString();
    } catch (error) {
        console.error("Error loading jackpot:", error);
    }
}

// Mở cửa sổ chọn vé
function openTicketModal() {
    document.getElementById("ticketModal").style.display = "block";
    generateTicketSelection();
}
function closeTicketModal() {
    document.getElementById("ticketModal").style.display = "none";
}

// Tạo giao diện chọn vé
function generateTicketSelection() {
    const ticketContainer = document.getElementById("ticketContainer");
    ticketContainer.innerHTML = "";

    for (let i = 0; i < ticketsPerPurchase; i++) {
        const div = document.createElement("div");
        div.classList.add("ticket");

        let numbers = [];
        for (let j = 0; j < 5; j++) {
            numbers.push(createNumberInput(1, 70));
        }
        numbers.push(createNumberInput(1, 25, true));

        numbers.forEach(num => div.appendChild(num));
        ticketContainer.appendChild(div);
    }
}

// Tạo input chọn số
function createNumberInput(min, max, isMegaBall = false) {
    const input = document.createElement("input");
    input.type = "number";
    input.min = min;
    input.max = max;
    input.classList.add(isMegaBall ? "mega-ball" : "normal-number");
    input.placeholder = isMegaBall ? "MB" : "##";
    return input;
}

// Chọn vé nhanh (Quick Pick)
function generateRandomTickets() {
    document.querySelectorAll(".ticket").forEach(ticket => {
        let selectedNumbers = new Set();
        while (selectedNumbers.size < 5) {
            selectedNumbers.add(Math.floor(Math.random() * 70) + 1);
        }
        ticket.querySelectorAll(".normal-number").forEach((input, index) => input.value = [...selectedNumbers][index]);

        ticket.querySelector(".mega-ball").value = Math.floor(Math.random() * 25) + 1;
    });
}

// Mua vé số
async function purchaseTickets() {
    let tickets = [];

    document.querySelectorAll(".ticket").forEach(ticket => {
        let numbers = [...ticket.querySelectorAll(".normal-number, .mega-ball")].map(input => Number(input.value));
        if (numbers.includes(0)) return alert("Please select all numbers!");
        tickets.push(numbers);
    });

    if (tickets.length !== ticketsPerPurchase) return alert("You must buy exactly 3 tickets!");

    const totalCost = ethers.utils.parseEther("0.0003");

    try {
        const approveTx = await frollToken.connect(signer).approve(lotteryContractAddress, totalCost);
        await approveTx.wait();

        const buyTx = await lotteryContract.connect(signer).buyTicket(tickets);
        await buyTx.wait();

        alert("Tickets purchased successfully!");
        closeTicketModal();
        loadUserTickets();
    } catch (error) {
        console.error("Purchase failed:", error);
        alert("Transaction failed. Please try again.");
    }
}

// Lấy vé của người dùng
async function loadUserTickets() {
    try {
        const tickets = await lotteryContract.getUserTickets(userAccount);
        document.getElementById("userTickets").innerText = tickets || "No tickets found";
    } catch (error) {
        console.error("Error loading tickets:", error);
        document.getElementById("userTickets").innerText = "Error loading tickets";
    }
}

// Kiểm tra Hash
async function checkHash() {
    const hashInput = document.getElementById("hashInput").value;
    if (!hashInput) return alert("Please enter a block hash!");

    try {
        const blockHash = ethers.utils.hexlify(hashInput);
        const result = await lotteryContract.getJackpotResult(blockHash);
        document.getElementById("hashResult").innerText = `Winning Numbers: ${result[0].join(", ")} | Hash: ${result[1]}`;
    } catch (error) {
        console.error("Error checking hash:", error);
        document.getElementById("hashResult").innerText = "Invalid hash or no result.";
    }
}

// Kết nối ví khi nhấn nút
document.getElementById("connectWallet").addEventListener("click", connectWallet);
