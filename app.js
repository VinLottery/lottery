// app.js - Lottery VIN Mega Millions
// Connects to the BNB Smart Chain, interacts with FROLL token & lottery contract

// Contract addresses
const FROLL_TOKEN_ADDRESS = "0x7783cBC17d43F936DA1C1D052E4a33a9FfF774c1";
const LOTTERY_CONTRACT_ADDRESS = "0x1988EfC318bc399e0E54F6758bb3a5A0D1fa0e5d";

// ABI definitions
const FROLL_ABI = [[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]];  // Paste full ABI of FROLL token here
const LOTTERY_ABI = [[{"inputs":[{"internalType":"contract IERC20","name":"_frollToken","type":"address"},{"internalType":"contract IBSCBlockhash","name":"_bscBlockhash","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256[6]","name":"jackpotNumbers","type":"uint256[6]"},{"indexed":false,"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"name":"JackpotDrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256[6]","name":"numbers","type":"uint256[6]"}],"name":"TicketPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"prize","type":"uint256"}],"name":"WinnerFound","type":"event"},{"inputs":[],"name":"bscBlockhash","outputs":[{"internalType":"contract IBSCBlockhash","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[6][]","name":"ticketSets","type":"uint256[6][]"}],"name":"buyTicket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"drawJackpot","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"frollToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatestWinningNumbers","outputs":[{"internalType":"uint256[6]","name":"","type":"uint256[6]"},{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"player","type":"address"}],"name":"getUserTickets","outputs":[{"components":[{"internalType":"uint256[6]","name":"numbers","type":"uint256[6]"}],"internalType":"struct MegaMillionsLottery.Ticket[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"getWinningNumbersByDate","outputs":[{"internalType":"uint256[6]","name":"","type":"uint256[6]"},{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"jackpotHistory","outputs":[{"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"jackpotPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDrawTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"participants","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ticketPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"winners","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]]; // Paste full ABI of Lottery contract here

let web3;
let userAccount;

// Initialize Web3 and connect to wallet
async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            userAccount = accounts[0];
            document.getElementById("walletAddress").textContent = `Connected: ${userAccount}`;
        } catch (error) {
            console.error("Wallet connection failed", error);
        }
    } else {
        alert("Please install MetaMask to connect your wallet.");
    }
}

// Event listener for wallet connection button
document.getElementById("connectWallet").addEventListener("click", connectWallet);
// Initialize contract instances
const frollContract = new web3.eth.Contract(FROLL_ABI, FROLL_TOKEN_ADDRESS);
const lotteryContract = new web3.eth.Contract(LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS);

// Function to generate ticket selection UI
function generateTickets() {
    const ticketGrid = document.getElementById("ticketGrid");
    ticketGrid.innerHTML = "";
    
    for (let i = 0; i < 10; i++) {
        const ticketDiv = document.createElement("div");
        ticketDiv.classList.add("ticket");

        const numbersDiv = document.createElement("div");
        numbersDiv.classList.add("numbers");

        for (let j = 1; j <= 70; j++) {
            const numberBtn = document.createElement("button");
            numberBtn.textContent = j;
            numberBtn.classList.add("number");
            numberBtn.onclick = () => selectNumber(i, j, false);
            numbersDiv.appendChild(numberBtn);
        }

        const megaBallDiv = document.createElement("div");
        megaBallDiv.classList.add("megaBall");

        for (let j = 1; j <= 25; j++) {
            const numberBtn = document.createElement("button");
            numberBtn.textContent = j;
            numberBtn.classList.add("number mega");
            numberBtn.onclick = () => selectNumber(i, j, true);
            megaBallDiv.appendChild(numberBtn);
        }

        const quickPickBtn = document.createElement("button");
        quickPickBtn.textContent = "🎲 Quick Pick";
        quickPickBtn.onclick = () => quickPickTicket(i);

        ticketDiv.appendChild(numbersDiv);
        ticketDiv.appendChild(megaBallDiv);
        ticketDiv.appendChild(quickPickBtn);

        ticketGrid.appendChild(ticketDiv);
    }
}

// Function to handle selecting numbers
let selectedNumbers = Array(10).fill().map(() => ({ numbers: [], mega: null }));

function selectNumber(ticketIndex, number, isMega) {
    if (isMega) {
        selectedNumbers[ticketIndex].mega = number;
    } else {
        if (selectedNumbers[ticketIndex].numbers.includes(number)) {
            selectedNumbers[ticketIndex].numbers = selectedNumbers[ticketIndex].numbers.filter(n => n !== number);
        } else if (selectedNumbers[ticketIndex].numbers.length < 5) {
            selectedNumbers[ticketIndex].numbers.push(number);
        }
    }
    updateTicketUI(ticketIndex);
}

// Function to update UI after selecting numbers
function updateTicketUI(ticketIndex) {
    const ticketDivs = document.querySelectorAll(".ticket");
    const ticketDiv = ticketDivs[ticketIndex];

    ticketDiv.querySelectorAll(".number").forEach(button => {
        const num = parseInt(button.textContent);
        if (selectedNumbers[ticketIndex].numbers.includes(num)) {
            button.classList.add("selected");
        } else {
            button.classList.remove("selected");
        }
    });

    ticketDiv.querySelectorAll(".number.mega").forEach(button => {
        const num = parseInt(button.textContent);
        if (selectedNumbers[ticketIndex].mega === num) {
            button.classList.add("selected");
        } else {
            button.classList.remove("selected");
        }
    });
}

// Function to quick pick a single ticket
function quickPickTicket(ticketIndex) {
    selectedNumbers[ticketIndex].numbers = [];
    while (selectedNumbers[ticketIndex].numbers.length < 5) {
        let randNum = Math.floor(Math.random() * 70) + 1;
        if (!selectedNumbers[ticketIndex].numbers.includes(randNum)) {
            selectedNumbers[ticketIndex].numbers.push(randNum);
        }
    }
    selectedNumbers[ticketIndex].mega = Math.floor(Math.random() * 25) + 1;
    updateTicketUI(ticketIndex);
}

// Function to quick pick all tickets
function quickPickAll() {
    for (let i = 0; i < 10; i++) {
        quickPickTicket(i);
    }
}

// Event listener for quick pick all button
document.getElementById("quickAll").addEventListener("click", quickPickAll);

// Generate tickets on page load
generateTickets();
