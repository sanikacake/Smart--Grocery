console.log("Script loaded");

let shoppingMode = false;
let total = 0;
let completed = 0;

// CATEGORY MAP (for shopping mode)
const categoryMap = {
    milk: "Dairy",
    cheese: "Dairy",
    butter: "Dairy",

    apple: "Fruits",
    banana: "Fruits",

    tomato: "Vegetables",
    onion: "Vegetables",
    potato: "Vegetables",

    chicken: "Meat",
    fish: "Meat"
};

const order = {
    Vegetables: 1,
    Fruits: 2,
    Dairy: 3,
    Meat: 4,
    Snacks: 5,
    Others: 6
};

// LOGIN
function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // Allowed credentials
    const validEmail = "admin@gmail.com";
    const validPassword = "1234";

    if (email === "" || password === "") {
        alert("Please fill all fields");
        return;
    }

    if (email === validEmail && password === validPassword) {
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid Email or Password");
    }
}
// TOGGLE SHOPPING MODE
function toggleShoppingMode() {
    shoppingMode = !shoppingMode;

    const btn = document.getElementById("modeBtn");

    btn.innerText = shoppingMode
        ? "🛒 Shopping Mode ON"
        : "🛒 Shopping Mode OFF";

    loadItems();
}

// LOAD ITEMS
async function loadItems() {
    const res = await fetch("http://localhost:5000/products");
    let data = await res.json();

    const list = document.getElementById("groceryList");
    list.innerHTML = "";

    total = 0;
    completed = 0;

    // assign category (fixed syntax)
    data.forEach(item => {
        let name = item.name.toLowerCase().trim();

        let foundKey = Object.keys(categoryMap).find(key =>
            name.includes(key)
        );

        item.category = foundKey ? categoryMap[foundKey] : "Others";
    });

    // sort when shopping mode ON
    if (shoppingMode) {
        data.sort((a, b) => order[a.category] - order[b.category]);
    }

    data.forEach(item => {
        let li = document.createElement("li");

        li.innerHTML = `
            <div class="item-left">
                <input type="checkbox"
                       onchange="toggleComplete(this)"
                       class="${shoppingMode ? 'big-check' : ''}">

                <span>${item.name}</span>

                <span class="priority ${item.priority || "Low"}">
                    ${item.priority === "High" ? "🔴" : item.priority === "Medium" ? "🟡" : "🟢"}
                    ${item.priority || "Low"}
                </span>

                ${shoppingMode ? `<small>(${item.category})</small>` : ""}
            </div>
            <button onclick="deleteItem('${item._id}')">Delete</button>
        `;

        list.appendChild(li);
        total++;
    });

    updateStats();
}

// ADD ITEM
async function addItem() {
    let input = document.getElementById("itemInput");
    let priority = document.getElementById("priority").value;

    let value = input.value.trim();

    if (value === "") {
        alert("Enter an item");
        return;
    }

    await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: value,
            priority: priority
        })
    });

    input.value = "";
    loadItems();
}

// TOGGLE COMPLETE
function toggleComplete(checkbox) {
    let span = checkbox.nextElementSibling;

    if (checkbox.checked) {
        span.classList.add("done");
        completed++;
    } else {
        span.classList.remove("done");
        completed--;
    }

    updateStats();
}

// DELETE ITEM
async function deleteItem(id) {
    await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE"
    });

    loadItems();
}

// UPDATE STATS
function updateStats() {
    document.getElementById("totalCount").innerText = total;
    document.getElementById("completedCount").innerText = completed;
    document.getElementById("pendingCount").innerText = total - completed;
}

// LOGOUT
function logout() {
    window.location.href = "index.html";
}

// LOAD ON PAGE OPEN
window.onload = loadItems;