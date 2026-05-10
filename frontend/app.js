const API_URL = "http://127.0.0.1:8000";

function showMessage(message, type){

    const box =
        document.getElementById("messageBox");

    box.innerText = message;

    box.className = type;

    box.style.display = "block";

    setTimeout(() => {
        box.style.display = "none";
    }, 3000);
}

async function register() {

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

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

    showMessage(data.message, "success");

    window.location.href = "login.html";
}

async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
    });

    const data = await response.json();

    localStorage.setItem("token", data.access_token);

    showMessage("Login successful", "success");

    window.location.href = "dashboard.html";
}

async function addExpense() {

    const title = document.getElementById("title").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;

    const token = localStorage.getItem("token");

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

    showMessage(data.message, "success");

    loadExpenses();
}

async function loadExpenses() {

    const token = localStorage.getItem("token");

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
            <p>Rs.${expense.amount}</p>
            <p>${expense.category}</p>
        `;

        expenseList.appendChild(card);
    });

    totalAmount.innerText = `Rs.${total}`;
}

function logout(){

    localStorage.removeItem("token");

    window.location.href = "login.html";
}
if(window.location.pathname.includes("dashboard.html")){
    loadExpenses();
}
