const contractAddress = "0xAB2bCA66Fbb467058Ed6EA048c2832FED072B1A4";
const frollTokenAddress = "0x7783cBC17d43F936DA1C1D052E4a33a9FfF774c1";
const abi = [{"inputs":[{"internalType":"contract IERC20","name":"_frollToken","type":"address"},{"internalType":"contract IBSCBlockhash","name":"_bscBlockhash","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256[6]","name":"jackpotNumbers","type":"uint256[6]"},{"indexed":false,"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"name":"JackpotDrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256[6]","name":"numbers","type":"uint256[6]"}],"name":"TicketPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"prize","type":"uint256"}],"name":"WinnerFound","type":"event"},{"inputs":[],"name":"bscBlockhash","outputs":[{"internalType":"contract IBSCBlockhash","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[6][]","name":"ticketSets","type":"uint256[6][]"}],"name":"buyTicket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"drawJackpot","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"frollToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatestWinningNumbers","outputs":[{"internalType":"uint256[6]","name":"","type":"uint256[6]"},{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"player","type":"address"}],"name":"getUserTickets","outputs":[{"components":[{"internalType":"uint256[6]","name":"numbers","type":"uint256[6]"}],"internalType":"struct MegaMillionsLottery.Ticket[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"jackpotHistory","outputs":[{"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"jackpotPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDrawTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"participants","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ticketPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"winners","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]; // ABI của hợp đồng xổ số
const frollAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]; // ABI của token FROLL

let web3, lotteryContract, frollToken, userAccount;

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            document.getElementById("connectWallet").innerText = userAccount.substring(0, 6) + "..." + userAccount.slice(-4);
            await initContracts();
            await updateBalances();
        } catch (error) {
            console.error("User denied account access", error);
        }
    } else {
        alert("Please install MetaMask!");
    }
}

async function initContracts() {
    lotteryContract = new web3.eth.Contract(abi, contractAddress);
    frollToken = new web3.eth.Contract(frollAbi, frollTokenAddress);
    await updateJackpot();
    await updateLatestResults();
}

async function updateBalances() {
    if (!userAccount) return;
    const bnbBalance = await web3.eth.getBalance(userAccount);
    const frollBalance = await frollToken.methods.balanceOf(userAccount).call();
    document.getElementById("jackpot").innerText = `BNB: ${web3.utils.fromWei(bnbBalance, "ether")}, FROLL: ${web3.utils.fromWei(frollBalance, "ether")}`;
}

async function updateJackpot() {
    const jackpot = await lotteryContract.methods.jackpotPool().call();
    document.getElementById("jackpot").innerText = `Jackpot: ${web3.utils.fromWei(jackpot, "ether")} FROLL`;
}

async function buyTicket() {
    let tickets = [];
    for (let i = 1; i <= 10; i++) {
        let ticket = [];
        for (let j = 1; j <= 5; j++) {
            const num = document.getElementById(`num${i}_${j}`).value;
            if (!num) continue;
            ticket.push(Number(num));
        }
        const megaBall = document.getElementById(`megaBall${i}`).value;
        if (megaBall) ticket.push(Number(megaBall));
        if (ticket.length === 6) tickets.push(ticket);
    }
    if (tickets.length === 0) return alert("Please select at least one ticket");
    
    const ticketPrice = await lotteryContract.methods.ticketPrice().call();
    const totalPrice = BigInt(ticketPrice) * BigInt(tickets.length);
    
    try {
        await frollToken.methods.approve(contractAddress, totalPrice.toString()).send({ from: userAccount });
        await lotteryContract.methods.buyTicket(tickets).send({ from: userAccount });
    } catch (error) {
        console.error("Transaction failed", error);
        alert("Transaction failed. Please try again.");
    }
}

async function updateLatestResults() {
    const result = await lotteryContract.methods.getLatestWinningNumbers().call();
    document.getElementById("winningNumbers").innerText = `Winning Numbers: ${result[0].join(", ")}`;
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("buyTicketBtn").addEventListener("click", buyTicket);
