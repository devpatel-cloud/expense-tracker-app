// Backend API URL
const API_URL = "";

// Show Message
function showMessage(message, type) {

    const box = document.getElementById("messageBox");

    box.innerText = message;

    box.className = type;

    box.style.display = "block";

    setTimeout(() => {
        box.style.display = "none";
    }, 3000);
}


// Register User
async function register() {

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {

            showMessage("Registration successful", "success");

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);

        } else {

            showMessage(data.detail || "Registration failed", "error");
        }

    } catch (error) {

        showMessage("Server error", "error");
    }
}


// Login User
async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    try {

        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem("token", data.access_token);

            showMessage("Login successful", "success");

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);

        } else {

            showMessage(data.detail || "Login failed", "error");
        }

    } catch (error) {

        showMessage("Server error", "error");
    }
}


// Add Expense
async function addExpense() {

    const title = document.getElementById("title").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(`${API_URL}/expenses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                amount,
                category
            })
        });

        const data = await response.json();

        if (response.ok) {

            showMessage("Expense added successfully", "success");

            loadExpenses();

        } else {

            showMessage(data.detail || "Failed to add expense", "error");
        }

    } catch (error) {

        showMessage("Server error", "error");
    }
}


// Load Expenses
async function loadExpenses() {

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(`${API_URL}/expenses`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const expenses = await response.json();

        const expenseList = document.getElementById("expenseList");

        const totalAmount = document.getElementById("totalAmount");

        expenseList.innerHTML = "";

        let total = 0;

        expenses.forEach(expense => {

            total += expense.amount;

            const card = document.createElement("div");

            card.classList.add("expense-card");

            card.innerHTML = `
                <h4>${expense.title}</h4>
                <p>Rs. ${expense.amount}</p>
                <p>${expense.category}</p>
            `;

            expenseList.appendChild(card);
        });

        totalAmount.innerText = `Rs. ${total}`;

    } catch (error) {

        showMessage("Failed to load expenses", "error");
    }
}


// Logout
function logout() {

    localStorage.removeItem("token");

    window.location.href = "login.html";
}


// Auto Load Expenses
if (window.location.pathname.includes("dashboard.html")) {

    loadExpenses();
}