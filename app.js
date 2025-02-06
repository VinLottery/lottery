const contractAddress = "0xAB2bCA66Fbb467058Ed6EA048c2832FED072B1A4";
const frollTokenAddress = "0x7783cBC17d43F936DA1C1D052E4a33a9FfF774c1";
const abi = [{"inputs":[{"internalType":"contract IERC20","name":"_frollToken","type":"address"},{"internalType":"contract IBSCBlockhash","name":"_bscBlockhash","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256[6]","name":"jackpotNumbers","type":"uint256[6]"},{"indexed":false,"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"name":"JackpotDrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256[6]","name":"numbers","type":"uint256[6]"}],"name":"TicketPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"prize","type":"uint256"}],"name":"WinnerFound","type":"event"},{"inputs":[],"name":"bscBlockhash","outputs":[{"internalType":"contract IBSCBlockhash","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[6][]","name":"ticketSets","type":"uint256[6][]"}],"name":"buyTicket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"drawJackpot","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"frollToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatestWinningNumbers","outputs":[{"internalType":"uint256[6]","name":"","type":"uint256[6]"},{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"player","type":"address"}],"name":"getUserTickets","outputs":[{"components":[{"internalType":"uint256[6]","name":"numbers","type":"uint256[6]"}],"internalType":"struct MegaMillionsLottery.Ticket[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"jackpotHistory","outputs":[{"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"jackpotPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDrawTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"participants","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ticketPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"winners","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]; // ABI của hợp đồng xổ số
const frollAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]; // ABI của token FROLL

let web3, lotteryContract, frollToken, userAccount;
document.addEventListener("DOMContentLoaded", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                userAccount = accounts[0];
                displayWalletInfo();
                await initContracts();
                await updateBalances();
                await updateJackpot();
                await updateLatestResults();
            }
        } catch (error) {
            console.error("Error checking accounts", error);
        }
    }
});

async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        displayWalletInfo();
        await initContracts();
        await updateBalances();
        await updateJackpot();
        await updateLatestResults();
    } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Failed to connect wallet. Please try again.");
    }
}

function displayWalletInfo() {
    document.getElementById("walletAddress").innerText = userAccount || "Not connected";
}

async function initContracts() {
    lotteryContract = new web3.eth.Contract(abi, contractAddress);
    frollToken = new web3.eth.Contract(frollAbi, frollTokenAddress);
}
async function buyTicket() {
    if (!userAccount) {
        alert("Please connect your wallet first!");
        return;
    }

    let tickets = [];
    for (let i = 1; i <= 10; i++) {
        let ticket = [];
        for (let j = 1; j <= 5; j++) {
            const num = document.getElementById(`num${i}_${j}`).value;
            if (!num || num < 1 || num > 70) continue; // Kiểm tra số hợp lệ
            ticket.push(Number(num));
        }
        const megaBall = document.getElementById(`megaBall${i}`).value;
        if (!megaBall || megaBall < 1 || megaBall > 25) {
            alert(`Mega Ball trên vé ${i} không hợp lệ!`);
            return;
        }
        ticket.push(Number(megaBall)); // Thêm số Mega Ball vào vé

        if (ticket.length === 6) {
            tickets.push(ticket);
        }
    }

    if (tickets.length === 0) {
        alert("Please select at least one complete ticket.");
        return;
    }

    try {
        const ticketPrice = await lotteryContract.methods.ticketPrice().call();
        const totalPrice = BigInt(ticketPrice) * BigInt(tickets.length);

        // Approve FROLL token trước khi mua vé
        await frollToken.methods.approve(contractAddress, totalPrice.toString()).send({ from: userAccount });

        // Gửi giao dịch mua vé
        await lotteryContract.methods.buyTicket(tickets).send({ from: userAccount });

        alert("Ticket purchase successful!");
        await updateBalances(); // Cập nhật số dư sau khi mua vé
    } catch (error) {
        console.error("Transaction failed", error);
        alert("Transaction failed. Please try again.");
    }
}

// Gán sự kiện cho nút mua vé
document.getElementById("buyTicketBtn").addEventListener("click", buyTicket);
async function updateJackpot() {
    if (!lotteryContract) return;
    try {
        const jackpot = await lotteryContract.methods.jackpotPool().call();
        document.getElementById("jackpot").innerText = `Jackpot: ${web3.utils.fromWei(jackpot, "ether")} FROLL`;
    } catch (error) {
        console.error("Error fetching jackpot:", error);
    }
}

async function updateLatestResults() {
    try {
        const result = await lotteryContract.methods.getLatestWinningNumbers().call();
        if (result[0].length > 0) {
            document.getElementById("winningNumbers").innerText = `Winning Numbers: ${result[0].join(", ")}`;
        } else {
            document.getElementById("winningNumbers").innerText = "No results available yet";
        }
    } catch (error) {
        console.error("Error fetching latest results", error);
    }
}

async function searchResultsByDate() {
    const dateInput = document.getElementById("searchDate").value;
    if (!dateInput) {
        alert("Please select a date.");
        return;
    }

    const timestamp = new Date(dateInput).setHours(0, 0, 0, 0) / 1000; // Convert to UNIX timestamp

    try {
        const result = await lotteryContract.methods.getWinningNumbersByDate(timestamp).call();
        if (result[0].length > 0) {
            document.getElementById("searchedResults").innerText = `Winning Numbers for ${dateInput}: ${result[0].join(", ")}`;
        } else {
            document.getElementById("searchedResults").innerText = `No results found for ${dateInput}`;
        }
    } catch (error) {
        console.error("Error fetching results by date", error);
    }
}

// Gán sự kiện cho tra cứu kết quả theo ngày
document.getElementById("searchResults").addEventListener("click", searchResultsByDate);

// Cập nhật jackpot và kết quả mới nhất khi tải trang
document.addEventListener("DOMContentLoaded", updateJackpot);
document.addEventListener("DOMContentLoaded", updateLatestResults);
function createTicketUI() {
    const ticketContainer = document.getElementById("ticketContainer");
    ticketContainer.innerHTML = ""; // Xóa vé cũ nếu có

    for (let i = 1; i <= 10; i++) {
        const ticketDiv = document.createElement("div");
        ticketDiv.classList.add("ticket");

        let inputs = "";
        for (let j = 1; j <= 5; j++) {
            inputs += `<input type="number" id="num${i}_${j}" min="1" max="70" placeholder="${j}">`;
        }
        inputs += `<input type="number" id="megaBall${i}" min="1" max="25" placeholder="MB">`;

        ticketDiv.innerHTML = `
            <p>Ticket ${i}</p>
            ${inputs}
            <button onclick="quickPick(${i})">Quick</button>
        `;
        ticketContainer.appendChild(ticketDiv);
    }
}

// Quick Pick cho từng vé
function quickPick(ticketNumber) {
    const selectedNumbers = new Set();
    while (selectedNumbers.size < 5) {
        selectedNumbers.add(Math.floor(Math.random() * 70) + 1);
    }
    const selectedMegaBall = Math.floor(Math.random() * 25) + 1;

    let index = 1;
    selectedNumbers.forEach(num => {
        document.getElementById(`num${ticketNumber}_${index}`).value = num;
        index++;
    });
    document.getElementById(`megaBall${ticketNumber}`).value = selectedMegaBall;
}

// Quick Pick cho tất cả 10 vé
document.getElementById("quickAll").addEventListener("click", () => {
    for (let i = 1; i <= 10; i++) {
        quickPick(i);
    }
});

// Gọi tạo UI khi trang tải
document.addEventListener("DOMContentLoaded", createTicketUI);
async function updateBalances() {
    if (!userAccount) return;
    try {
        const bnbBalance = await web3.eth.getBalance(userAccount);
        const frollBalance = await frollToken.methods.balanceOf(userAccount).call();

        document.getElementById("bnbBalance").innerText = web3.utils.fromWei(bnbBalance, "ether");
        document.getElementById("frollBalance").innerText = web3.utils.fromWei(frollBalance, "ether");
    } catch (error) {
        console.error("Error updating balances:", error);
    }
}

// Cập nhật số dư khi trang tải
document.addEventListener("DOMContentLoaded", updateBalances);
