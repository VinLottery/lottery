// Contract Details (Thay thế bằng địa chỉ thực tế)
const lotteryContractAddress = "0x28ba1dE00bF69B7acE03364eEA1E34F86Cde2944"; 
const frollTokenAddress = "0x7783cBC17d43F936DA1C1D052E4a33a9FfF774c1"; 

// Giá vé 0.0001 FROLL (đơn vị Wei)
const ticketPrice = ethers.utils.parseEther("0.0001");

let provider, signer, userAccount;
let lotteryContract, frollToken;

// ABI hợp đồng xổ số
const lotteryABI = [ 
    {
        "inputs": [{"internalType": "contract IERC20", "name": "_frollToken", "type": "address"}, 
                   {"internalType": "contract IBSCBlockhash", "name": "_bscBlockhash", "type": "address"}],
        "stateMutability": "nonpayable", "type": "constructor"
    },
    {
        "inputs": [{"internalType": "uint256[6][]", "name": "ticketSets", "type": "uint256[6][]"}],
        "name": "buyTicket", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    {
        "inputs": [], "name": "lastDrawTimestamp",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "jackpotHistory",
        "outputs": [{"internalType": "bytes32", "name": "blockHash", "type": "bytes32"}],
        "stateMutability": "view", "type": "function"
    }
];

// ABI hợp đồng token FROLL (Chuẩn ERC-20)
const tokenABI = [
    {
        "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "spender", "type": "address"},
                   {"internalType": "uint256", "name": "value", "type": "uint256"}],
        "name": "approve",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "nonpayable", "type": "function"
    }
];

// Kết nối ví MetaMask
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

// Khởi tạo hợp đồng thông minh
function initContracts() {
    lotteryContract = new ethers.Contract(lotteryContractAddress, lotteryABI, signer);
    frollToken = new ethers.Contract(frollTokenAddress, tokenABI, signer);

    loadJackpotData();
}

// Lấy thông tin Jackpot & thời gian mở thưởng
async function loadJackpotData() {
    try {
        const jackpotBalance = await frollToken.balanceOf(lotteryContractAddress);
        const jackpotInFroll = ethers.utils.formatEther(jackpotBalance);
        document.getElementById("jackpotAmount").innerText = `${jackpotInFroll} FROLL`;

        const lastDrawTimestamp = await lotteryContract.lastDrawTimestamp();
        if (lastDrawTimestamp.toNumber() === 0) {
            document.getElementById("nextDrawTime").innerText = "Waiting for first draw...";
        } else {
            const nextDraw = new Date((lastDrawTimestamp.toNumber() + 86400) * 1000);
            document.getElementById("nextDrawTime").innerText = nextDraw.toUTCString();
        }
    } catch (error) {
        console.error("Error fetching jackpot:", error);
        document.getElementById("jackpotAmount").innerText = "Error loading jackpot";
    }
}

// Mở & đóng cửa sổ chọn vé
function openTicketModal() {
    document.getElementById("ticketModal").style.display = "block";
    generateTicketSelection();
}
function closeTicketModal() {
    document.getElementById("ticketModal").style.display = "none";
}

// Tạo giao diện chọn vé số
function generateTicketSelection() {
    const ticketContainer = document.getElementById("ticketContainer");
    ticketContainer.innerHTML = "";

    for (let i = 0; i < 5; i++) {
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

    if (tickets.length === 0) return alert("No valid tickets selected!");

    const totalCost = ticketPrice.mul(tickets.length);

    try {
        const balance = await frollToken.balanceOf(userAccount);
        if (balance.lt(totalCost)) {
            return alert("Insufficient FROLL balance!");
        }

        const approveTx = await frollToken.connect(signer).approve(lotteryContractAddress, totalCost);
        await approveTx.wait();

        const buyTx = await lotteryContract.connect(signer).buyTicket(tickets);
        await buyTx.wait();

        alert("Tickets purchased successfully!");
        closeTicketModal();
    } catch (error) {
        console.error("Purchase failed:", error);
        alert("Transaction failed. Please try again.");
    }
}

// Kết nối ví khi nhấn nút
document.getElementById("connectWallet").addEventListener("click", connectWallet);
