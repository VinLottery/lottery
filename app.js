document.addEventListener("DOMContentLoaded", async () => {
    // DOM Elements
    const walletButton = document.getElementById("connectWallet");
    const walletAddressDisplay = document.getElementById("walletAddress");
    const frollBalanceDisplay = document.getElementById("frollBalance");
    const bnbBalanceDisplay = document.getElementById("bnbBalance");
    const jackpotAmount = document.getElementById("jackpot-amount");
    const submitTicketButton = document.getElementById("buyTickets");
    const resultMessage = document.getElementById("transaction-status");
    const countdownTimer = document.getElementById("countdownTimer");
    
    // Địa chỉ hợp đồng trên BSC
    const FROLL_ADDRESS = "0x7783cBC17d43F936DA1C1D052E4a33a9FfF774c1";
    const LOTTERY_ADDRESS = "0x28ba1dE00bF69B7acE03364eEA1E34F86Cde2944";

    // ABI hợp đồng
    const FROLL_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]; // Dán ABI token FROLL ở đây
    const LOTTERY_ABI = [{"inputs":[{"internalType":"contract IERC20","name":"_frollToken","type":"address"},{"internalType":"contract IBSCBlockhash","name":"_bscBlockhash","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256[6]","name":"jackpotNumbers","type":"uint256[6]"},{"indexed":false,"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"name":"JackpotDrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256[6]","name":"numbers","type":"uint256[6]"}],"name":"TicketPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"prize","type":"uint256"}],"name":"WinnerFound","type":"event"},{"inputs":[],"name":"bscBlockhash","outputs":[{"internalType":"contract IBSCBlockhash","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[6][]","name":"ticketSets","type":"uint256[6][]"}],"name":"buyTicket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"drawJackpot","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"frollToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"jackpotHistory","outputs":[{"internalType":"bytes32","name":"blockHash","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDrawTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"participants","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ticketPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"winners","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]; // Dán ABI hợp đồng Mega Millions ở đây

    let provider, signer, frollToken, lotteryContract, userAddress;

    // Lắng nghe khi trang tải hoàn thành và gọi startCountdown
    window.addEventListener("load", () => {
        fetchJackpotBalance(); // Hiển thị jackpot khi trang tải
        startCountdown();  // Bắt đầu đồng hồ đếm ngược khi trang được tải
        setupTicketGrid(); // Thiết lập lưới số
    });

    // Kết nối ví MetaMask
    async function connectWallet() {
        if (window.ethereum) {
            try {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);  // Yêu cầu quyền truy cập tài khoản

                signer = provider.getSigner();
                userAddress = await signer.getAddress();
                walletAddressDisplay.textContent = `Connected: ${userAddress}`;

                // Load Contracts
                frollToken = new ethers.Contract(FROLL_ADDRESS, FROLL_ABI, signer);
                lotteryContract = new ethers.Contract(LOTTERY_ADDRESS, LOTTERY_ABI, signer);

                // Lấy số dư ví
                fetchWalletBalance();
            } catch (error) {
                console.error("Wallet connection failed:", error);
                alert("There was an error connecting to MetaMask.");
            }
        } else {
            alert("MetaMask is not installed. Please install it to use this feature.");
        }
    }

    // Lấy số dư BNB & FROLL trong ví
    async function fetchWalletBalance() {
        try {
            const bnbBalance = await provider.getBalance(userAddress);
            bnbBalanceDisplay.textContent = `${ethers.utils.formatEther(bnbBalance)} BNB`;

            const frollBalance = await frollToken.balanceOf(userAddress);
            frollBalanceDisplay.textContent = `${ethers.utils.formatUnits(frollBalance, 18)} FROLL`;
        } catch (error) {
            console.error("Failed to fetch wallet balance:", error);
        }
    }

    // Lấy số dư jackpot từ hợp đồng xổ số
    async function fetchJackpotBalance() {
        if (!lotteryContract) return;
        try {
            const balance = await frollToken.balanceOf(LOTTERY_ADDRESS);
            jackpotAmount.textContent = `${ethers.utils.formatUnits(balance, 18)} FROLL`;
        } catch (error) {
            console.error("Failed to fetch jackpot balance:", error);
            jackpotAmount.textContent = "Error loading jackpot.";
        }
    }

    // Đồng hồ đếm ngược
    function startCountdown() {
        setInterval(() => {
            const now = new Date();
            const targetTime = new Date();
            targetTime.setUTCHours(0, 10, 0, 0); // Thời gian quay số là 00:10 UTC

            const timeDifference = targetTime - now;

            if (timeDifference <= 0) {
                countdownTimer.textContent = "Draw is happening now!";
            } else {
                const hours = Math.floor(timeDifference / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                countdownTimer.textContent = `${hours}h ${minutes}m ${seconds}s`;
            }
        }, 1000);
    }

    // Chọn số tự động
    function selectRandomTicket() {
        let numbers = [];
        while (numbers.length < 6) {
            let num = Math.floor(Math.random() * 70) + 1;
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }
        return numbers;
    }

    // Chọn số thủ công (người dùng chọn số)
    function selectCustomTicket() {
        const selectedNumbers = [];
        document.querySelectorAll(".number.selected").forEach(button => {
            selectedNumbers.push(parseInt(button.getAttribute("data-number")));
        });
        return selectedNumbers;
    }

    // Cài đặt lưới số
    function setupTicketGrid() {
        const numberGridTop = document.getElementById("number-grid-top");
        const numberGridBottom = document.getElementById("number-grid-bottom");

        // Tạo các số từ 1 đến 70
        for (let i = 1; i <= 70; i++) {
            const button = document.createElement("button");
            button.classList.add("number");
            button.setAttribute("data-number", i);
            button.textContent = i;
            numberGridTop.appendChild(button);
        }

        // Tạo các số từ 1 đến 25 (Powerball)
        for (let i = 1; i <= 25; i++) {
            const button = document.createElement("button");
            button.classList.add("number");
            button.setAttribute("data-number", i);
            button.textContent = i;
            numberGridBottom.appendChild(button);
        }
    }

    // Xử lý chọn số
    document.querySelectorAll(".number").forEach(button => {
        button.addEventListener("click", () => {
            button.classList.toggle("selected");
        });
    });

    // Gửi vé xổ số
    submitTicketButton.addEventListener("click", async () => {
        let ticketNumbers = selectCustomTicket();

        // Nếu không có số nào được chọn, chọn vé ngẫu nhiên
        if (ticketNumbers.length === 0) {
            ticketNumbers = selectRandomTicket();
        }

        if (ticketNumbers.length !== 6) {
            alert("You need to select 6 numbers!");
            return;
        }

        // Gửi ticket và thanh toán bằng FROLL
        try {
            resultMessage.textContent = "Submitting ticket...";

            // Tính phí vé (ví dụ 0.01 FROLL)
            const ticketPrice = ethers.utils.parseUnits("0.01", 18); // 0.01 FROLL
            const tx = await lotteryContract.buyTicket([ticketNumbers], {
                value: ticketPrice // Thanh toán bằng FROLL
            });

            // Đợi giao dịch thành công
            await tx.wait();

            resultMessage.textContent = "Ticket successfully submitted!";
        } catch (error) {
            console.error("Ticket submission failed:", error);
            resultMessage.textContent = "Failed to submit ticket.";
        }
    });

    // Kết nối ví khi người dùng nhấn nút
    walletButton.addEventListener("click", connectWallet);
});
