// Contract Details
const lotteryContractAddress = "0x28ba1dE00bF69B7acE03364eEA1E34F86Cde2944"; 
const frollTokenAddress = "0x7783cBC17d43F936DA1C1D052E4a33a9FfF774c1"; 
const ticketPrice = web3.utils.toWei("0.0001", "ether"); // 0.0001 FROLL

let web3;
let lotteryContract;
let frollToken;
let userAccount;

    // ABI hợp đồng
    const tokenABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]; // Dán ABI token FROLL ở đây
    const lotteryABI = [{"inputs":[{"internalType":"contract IERC20","name":"_frollToken","type":"address"},{"internalType":"contract IBSCBlockhash","name":"_bscBlockhash","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256[6]","name":"jackpotNumbers","type":"uint256[6]"},{"indexed":false,"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"name":"JackpotDrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256[6]","name":"numbers","type":"uint256[6]"}],"name":"TicketPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"prize","type":"uint256"}],"name":"WinnerFound","type":"event"},{"inputs":[],"name":"bscBlockhash","outputs":[{"internalType":"contract IBSCBlockhash","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[6][]","name":"ticketSets","type":"uint256[6][]"}],"name":"buyTicket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"drawJackpot","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"frollToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"jackpotHistory","outputs":[{"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDrawTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"participants","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ticketPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"winners","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]; // Dán ABI hợp đồng Mega Millions ở đây

    // Connect to MetaMask
async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            userAccount = accounts[0];
            document.getElementById("connectWallet").innerText = "Connected";
            initContracts();
        } catch (error) {
            console.error("Wallet connection failed:", error);
        }
    } else {
        alert("Please install MetaMask!");
    }
}

// Initialize Contracts
async function initContracts() {
    lotteryContract = new web3.eth.Contract(lotteryABI, lotteryContractAddress);
    frollToken = new web3.eth.Contract(tokenABI, frollTokenAddress);

    loadJackpotData();
}

// Load Jackpot & Recent Winners
async function loadJackpotData() {
    const jackpotBalance = await frollToken.methods.balanceOf(lotteryContractAddress).call();
    document.getElementById("jackpotAmount").innerText = `${web3.utils.fromWei(jackpotBalance, "ether")} FROLL`;

    const lastDrawTimestamp = await lotteryContract.methods.lastDrawTimestamp().call();
    document.getElementById("lastDrawDate").innerText = new Date(lastDrawTimestamp * 1000).toLocaleDateString();

    const lastDrawNumbers = await lotteryContract.methods.jackpotHistory(lastDrawTimestamp).call();
    document.getElementById("lastDrawNumbers").innerText = lastDrawNumbers.numbers.join(", ");
}

// Open & Close Ticket Modal
function openTicketModal() {
    document.getElementById("ticketModal").style.display = "block";
    generateTicketSelection();
}
function closeTicketModal() {
    document.getElementById("ticketModal").style.display = "none";
}

// Generate Ticket Selection
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

// Create Number Input
function createNumberInput(min, max, isMegaBall = false) {
    const input = document.createElement("input");
    input.type = "number";
    input.min = min;
    input.max = max;
    input.classList.add(isMegaBall ? "mega-ball" : "normal-number");
    input.placeholder = isMegaBall ? "MB" : "##";
    return input;
}

// Generate Random Tickets
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

// Purchase Tickets
async function purchaseTickets() {
    let tickets = [];
    
    document.querySelectorAll(".ticket").forEach(ticket => {
        let numbers = [...ticket.querySelectorAll(".normal-number, .mega-ball")].map(input => Number(input.value));
        if (numbers.includes(0)) return alert("Please select all numbers!");
        tickets.push(numbers);
    });

    if (tickets.length === 0) return alert("No valid tickets selected!");

    const totalCost = ticketPrice * tickets.length;

    try {
        await frollToken.methods.approve(lotteryContractAddress, totalCost.toString()).send({ from: userAccount });
        await lotteryContract.methods.buyTicket(tickets).send({ from: userAccount });

        alert("Tickets purchased successfully!");
        closeTicketModal();
    } catch (error) {
        console.error("Purchase failed:", error);
        alert("Transaction failed. Please try again.");
    }
}

// Connect Wallet on Click
document.getElementById("connectWallet").addEventListener("click", connectWallet);
