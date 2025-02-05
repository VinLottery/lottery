document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const connectWalletButton = document.getElementById('connectWallet');
    const buyTicketButton = document.getElementById('buyTicket');
    const claimPrizeButton = document.getElementById('claimPrize');
    const walletInfo = document.getElementById('walletInfo');
    const frollBalanceDisplay = document.getElementById('frollBalance');
    const bnbBalanceDisplay = document.getElementById('bnbBalance');

    let provider, signer, userAccount, lotteryContract, frollTokenContract;

    // Địa chỉ hợp đồng
    const contractAddress = '0xFF11f688143860bf495971d0720d8e55d93A3600'; // Hợp đồng xổ số
    const frollTokenAddress = '0x7783cBC17d43F936DA1C1D052E4a33a9FfF774c1'; // Token FROLL

    // ABI của hợp đồng xổ số
    const contractABI = [
        {"inputs":[{"internalType":"contract IERC20","name":"_frollToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
        {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"ticketNumber","type":"uint256"}],"name":"TicketPurchased","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"WinnerDeclared","type":"event"},
        {"inputs":[{"internalType":"uint256","name":"ticketNumber","type":"uint256"}],"name":"buyTicket","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"winners","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"ticketPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
    ];

    // ABI của token FROLL
    const frollTokenABI = [
        {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
    ];

    // **Kết nối ví Metamask**
    async function connectWallet() {
        if (!window.ethereum) {
            alert("Please install Metamask to use this DApp!");
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            userAccount = accounts[0];
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            lotteryContract = new ethers.Contract(contractAddress, contractABI, signer);
            frollTokenContract = new ethers.Contract(frollTokenAddress, frollTokenABI, signer);

            connectWalletButton.textContent = "Wallet Connected";
            walletInfo.textContent = `Wallet Address: ${userAccount}`;

            // Cập nhật số dư
            await updateBalances();
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    }

    // **Lấy số dư FROLL & BNB**
    async function updateBalances() {
        if (!userAccount) return;

        try {
            const frollBalance = await frollTokenContract.balanceOf(userAccount);
            frollBalanceDisplay.textContent = `FROLL Balance: ${ethers.utils.formatUnits(frollBalance, 18)}`;

            const bnbBalance = await provider.getBalance(userAccount);
            bnbBalanceDisplay.textContent = `BNB Balance: ${ethers.utils.formatEther(bnbBalance)}`;
        } catch (error) {
            console.error("Error fetching balances:", error);
        }
    }

    // **Mua vé xổ số**
    async function buyTicket() {
        if (!userAccount) {
            alert("Please connect your wallet first!");
            return;
        }

        // Lấy số vé người dùng chọn
        const ticketNumbers = [];
        for (let i = 1; i <= 5; i++) {
            const ticket = parseInt(document.getElementById(`ticket${i}`).value);
            if (ticket >= 1 && ticket <= 70 && !ticketNumbers.includes(ticket)) {
                ticketNumbers.push(ticket);
            } else {
                alert(`Invalid number for ticket ${i}. Must be between 1-70 and unique.`);
                return;
            }
        }

        const ticket6 = parseInt(document.getElementById('ticket6').value);
        if (ticket6 < 1 || ticket6 > 25) {
            alert("Invalid last ticket number. Must be between 1-25.");
            return;
        }
        ticketNumbers.push(ticket6);

        const ticketPrice = ethers.utils.parseUnits("0.0001", "ether"); 
        const approveAmount = ethers.utils.parseUnits("100", "ether"); // Cấp quyền 100 FROLL để tránh approve nhiều lần

        try {
            // Kiểm tra nếu hợp đồng đã được approve trước đó
            const allowance = await frollTokenContract.allowance(userAccount, contractAddress);
            if (allowance.lt(ticketPrice)) {
                console.log("Approving FROLL for contract...");
                const approveTx = await frollTokenContract.approve(contractAddress, approveAmount);
                await approveTx.wait();
            }

            console.log("Buying ticket...");
            const tx = await lotteryContract.buyTicket(ticketNumbers);
            await tx.wait();

            alert("Ticket purchased successfully!");
            await updateBalances();
        } catch (error) {
            console.error("Error buying ticket:", error);
            alert("Transaction failed! Check console for details.");
        }
    }

    // **Rút thưởng nếu trúng số**
    async function claimPrize() {
        if (!userAccount) {
            alert("Please connect your wallet first!");
            return;
        }

        try {
            const isWinner = await lotteryContract.winners(userAccount);
            if (!isWinner) {
                alert("You are not a winner for this draw.");
                return;
            }

            const tx = await lotteryContract.claimPrize();
            await tx.wait();

            alert("Prize claimed successfully!");
            await updateBalances();
        } catch (error) {
            console.error("Error claiming prize:", error);
            alert("Failed to claim prize!");
        }
    }

    // **Gán sự kiện vào các nút bấm**
    connectWalletButton.addEventListener("click", connectWallet);
    buyTicketButton.addEventListener("click", buyTicket);
    claimPrizeButton.addEventListener("click", claimPrize);
});
