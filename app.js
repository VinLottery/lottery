// Kiểm tra nếu Metamask có sẵn
if (typeof window.ethereum !== 'undefined') {
    console.log('Metamask is installed!');
} else {
    alert('Please install Metamask to use this DApp!');
}

const connectWalletButton = document.getElementById('connectWallet');
const buyTicketButton = document.getElementById('buyTicket');
const claimPrizeButton = document.getElementById('claimPrize');
const ticketInput = document.getElementById('ticketNumber');

let provider;
let signer;
let userAccount;
let lotteryContract;
let frollTokenContract;

// Địa chỉ hợp đồng và ABI
const contractAddress = '0x7D77d1079370d2e77a339d92b6bDa291bAb2FBea'; // Địa chỉ hợp đồng FrollLottery
const frollTokenAddress = '0x7783cBC17d43F936DA1C1D052E4a33a9FfF774c1'; // Địa chỉ token FROLL

// ABI của hợp đồng FrollLottery
const contractABI = [
    {"inputs":[{"internalType":"contract IERC20","name":"_frollToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"ticketNumber","type":"uint256"}],"name":"TicketPurchased","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"WinnerDeclared","type":"event"},
    {"inputs":[{"internalType":"uint256","name":"ticketNumber","type":"uint256"}],"name":"buyTicket","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"closeTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"name":"determineWinners","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"drawTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"frollToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"participants","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"ticketPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"tickets","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"winners","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}
];

// ABI của token FROLL
const frollTokenABI = [
    {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
    {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},
    {"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},
    {"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},
    {"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},
    {"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},
    {"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},
    {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}
];
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            lotteryContract = new ethers.Contract(contractAddress, contractABI, signer);
            frollTokenContract = new ethers.Contract(frollTokenAddress, frollTokenABI, signer);
            connectWalletButton.textContent = 'Wallet Connected';
            console.log('Account:', userAccount);
        } catch (err) {
            console.error('Error connecting wallet:', err);
        }
    } else {
        alert('Please install Metamask!');
    }
}

async function buyTicket() {
    const ticketNumbers = [];
    // Lấy các số vé từ input
    for (let i = 1; i <= 5; i++) {
        const ticket = document.getElementById(`ticket${i}`).value;
        if (ticket >= 1 && ticket <= 70 && !ticketNumbers.includes(ticket)) {
            ticketNumbers.push(ticket);
        } else {
            alert(`Please enter a valid number for ticket ${i}. Numbers must be between 1 and 70 and unique.`);
            return;
        }
    }

    const ticket6 = document.getElementById('ticket6').value;
    if (ticket6 < 1 || ticket6 > 25) {
        alert('Please enter a valid number for the last ticket (1-25).');
        return;
    }

    // Tính phí mua vé
    const price = ethers.utils.parseUnits('0.0001', 'ether'); // Giá vé 0.0001 FROLL

    try {
        // Gửi giao dịch để mua vé
        const tx = await lotteryContract.buyTicket(ticketNumbers.concat(ticket6), {
            value: price
        });
        await tx.wait();
        alert('Ticket purchased successfully!');
    } catch (err) {
        console.error('Error buying ticket:', err);
    }
}

async function claimPrize() {
    try {
        const tx = await lotteryContract.claimPrize();
        await tx.wait();
        alert('Prize claimed successfully!');
    } catch (err) {
        console.error('Error claiming prize:', err);
    }
}

// Lắng nghe các sự kiện
connectWalletButton.addEventListener('click', connectWallet);
buyTicketButton.addEventListener('click', buyTicket);
claimPrizeButton.addEventListener('click', claimPrize);
