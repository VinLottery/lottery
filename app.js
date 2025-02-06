// Contract Addresses
const lotteryContractAddress = "0x28ba1dE00bF69B7acE03364eEA1E34F86Cde2944"; 
const frollTokenAddress = "0x7783cBC17d43F936DA1C1D052E4a33a9FfF774c1"; 

// Giá vé 0.0001 FROLL (Wei)
const ticketPrice = ethers.utils.parseEther("0.0001");

let provider, signer, userAccount;
let lotteryContract, frollToken;

// Khởi tạo ABI hợp đồng xổ số
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
    }
];

// Khởi tạo ABI hợp đồng token FROLL
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
        "name": "approve", "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
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
    loadUserBalance();
    loadUserTickets();
}

// Hiển thị số dư ví (FROLL & BNB)
async function loadUserBalance() {
    try {
        const bnbBalance = await provider.getBalance(userAccount);
        const frollBalance = await frollToken.balanceOf(userAccount);

        document.getElementById("bnbBalance").innerText = `BNB: ${ethers.utils.formatEther(bnbBalance)} BNB`;
        document.getElementById("frollBalance").innerText = `FROLL: ${ethers.utils.formatEther(frollBalance)} FROLL`;
    } catch (error) {
        console.error("Error fetching balance:", error);
    }
}

// Hiển thị Jackpot & thời gian quay số
async function loadJackpotData() {
    try {
        const jackpotBalance = await frollToken.balanceOf(lotteryContractAddress);
        document.getElementById("jackpotAmount").innerText = `${ethers.utils.formatEther(jackpotBalance)} FROLL`;

        const lastDrawTimestamp = await lotteryContract.lastDrawTimestamp();
        const lastDrawTime = lastDrawTimestamp.toNumber();

        if (lastDrawTime === 0) {
            document.getElementById("nextDrawTime").innerText = "Pending...";
        } else {
            const nextDraw = new Date((lastDrawTime + 86400) * 1000);
            document.getElementById("nextDrawTime").innerText = nextDraw.toUTCString();
        }

        startCountdown();
    } catch (error) {
        console.error("Error fetching jackpot:", error);
        document.getElementById("jackpotAmount").innerText = "Error loading jackpot";
        document.getElementById("nextDrawTime").innerText = "Error loading draw time";
    }
}

// Chuẩn hóa vé số theo định dạng dễ đọc
function formatTickets(tickets) {
    return tickets.map((ticket, index) => {
        return `${index + 1}#: ${ticket.slice(0, 5).join(",")};${ticket[5]}`;
    }).join("\n");
}

// Mua vé số (gộp 10 vé vào 1 giao dịch)
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

        alert(`Tickets purchased successfully!\n${formatTickets(tickets)}`);
        closeTicketModal();
        loadUserTickets();
        loadUserBalance();
    } catch (error) {
        console.error("Purchase failed:", error);
        alert("Transaction failed. Please try again.");
    }
}

// Đếm ngược đến 00:10 UTC hàng ngày
function startCountdown() {
    function updateCountdown() {
        const now = new Date();
        const nextDraw = new Date();
        nextDraw.setUTCHours(0, 10, 0, 0);
        if (now >= nextDraw) {
            nextDraw.setUTCDate(nextDraw.getUTCDate() + 1);
        }

        const diff = nextDraw - now;
        const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
        const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
        const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");

        document.getElementById("countdown").innerText = `${hours}:${minutes}:${seconds}`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Gán sự kiện cho các nút
document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.querySelector(".play-btn").addEventListener("click", openTicketModal);
document.getElementById("buyTickets").addEventListener("click", purchaseTickets);
