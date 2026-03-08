function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Please fill all fields");
        return;
    }

    window.location.href = "dashboard.html";
}

let total = 0;
let completed = 0;

async function loadItems() {
    const res = await fetch("https://smart-grocery-w15u.onrender.com/products");
    const data = await res.json();

    const list = document.getElementById("groceryList");
    list.innerHTML = "";

    total = 0;
    completed = 0;

    data.forEach(item => {
        let li = document.createElement("li");

        li.innerHTML = `
            <div class="item-left">
                <input type="checkbox" onchange="toggleComplete(this)">
                <span>${item.name}</span>
            </div>
            <button onclick="deleteItem(this, '${item._id}')">Delete</button>
        `;

        list.appendChild(li);
        total++;
    });

    updateStats();
}

async function addItem() {
    let input = document.getElementById("itemInput");
    let value = input.value.trim();

    if (value === "") {
        alert("Enter an item");
        return;
    }

    await fetch("https://smart-grocery-w15u.onrender.com/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: value,
            price: 0
        })
    });

    input.value = "";
    loadItems();
}

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

async function deleteItem(button, id) {
    await fetch(`https://smart-grocery-w15u.onrender.com/products/${id}`, {
        method: "DELETE"
    });

    button.parentElement.remove();
    total--;
    updateStats();
}

function updateStats() {
    document.getElementById("totalCount").innerText = total;
    document.getElementById("completedCount").innerText = completed;
    document.getElementById("pendingCount").innerText = total - completed;
}

function logout() {
    window.location.href = "index.html";
}

window.onload = loadItems;