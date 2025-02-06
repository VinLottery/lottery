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
        "inputs": [], "name": "lastDrawTimestamp",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "ticketPrice",
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
            document.getElementById("nextDrawTime").innerText = "Not available";
        } else {
            const nextDraw = new Date((lastDrawTime + 86400) * 1000);
            document.getElementById("nextDrawTime").innerText = nextDraw.toUTCString();
        }
    } catch (error) {
        console.error("Error fetching jackpot:", error);
        document.getElementById("jackpotAmount").innerText = "Error loading jackpot";
        document.getElementById("nextDrawTime").innerText = "Error loading draw time";
    }
}

// Lấy vé số của người chơi
async function loadUserTickets() {
    try {
        const ticketCount = await lotteryContract.participants(userAccount);

        if (ticketCount.toNumber() === 0) {
            document.getElementById("userTickets").innerHTML = "<p>You have no tickets.</p>";
            return;
        }

        let ticketsHTML = "<h3>Your Tickets:</h3><ul>";
        for (let i = 0; i < ticketCount.toNumber(); i++) {
            const ticketData = await lotteryContract.tickets(userAccount, i);
            let ticketNumbers = ticketData.map(num => num.toNumber());
            ticketsHTML += `<li>${i + 1}#: ${ticketNumbers.slice(0, 5).join(",")};${ticketNumbers[5]}</li>`;
        }
        ticketsHTML += "</ul>";

        document.getElementById("userTickets").innerHTML = ticketsHTML;
    } catch (error) {
        console.error("Error fetching tickets:", error);
        document.getElementById("userTickets").innerHTML = "<p>Error loading tickets.</p>";
    }
}

// Mở cửa sổ chọn vé
function openTicketModal() {
    document.getElementById("ticketModal").style.display = "block";
}

// Đóng cửa sổ chọn vé
function closeTicketModal() {
    document.getElementById("ticketModal").style.display = "none";
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

        alert(`Tickets purchased successfully!`);
        closeTicketModal();
        loadUserTickets();
        loadUserBalance();
    } catch (error) {
        console.error("Purchase failed:", error);
        alert("Transaction failed. Please try again.");
    }
}

// Gán sự kiện cho các nút
document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.querySelector(".play-btn").addEventListener("click", openTicketModal);
document.getElementById("buyTickets").addEventListener("click", purchaseTickets);
