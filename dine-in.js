
// ================= DINE IN TABLE SELECTION =================

const tables = document.querySelectorAll(".table-card");
const selectedTableText = document.getElementById("selectedTable");
const continueBtn = document.getElementById("continueBtn");
const tableMessage = document.getElementById("tableMessage");

const orderChoice = document.getElementById("orderChoice");
const coffeeBtn = document.getElementById("coffeeBtn");
const pastryBtn = document.getElementById("pastryBtn");

let selectedTable = null;


// ================= SELECT TABLE =================

tables.forEach(table => {

    table.addEventListener("click", () => {

        // Remove previous selection
        tables.forEach(item => {
            item.classList.remove("selected");
        });

        // Select clicked table
        table.classList.add("selected");

        // Get table name
        selectedTable = table.dataset.table;

        // Display selected table
        selectedTableText.textContent = selectedTable;

        // Enable Continue
        continueBtn.disabled = false;

        // Hide order options if user changes table
        orderChoice.classList.remove("show");

        // Clear message
        tableMessage.textContent = "";

    });

});


// ================= CONTINUE =================

continueBtn.addEventListener("click", () => {

    if (!selectedTable) {

        tableMessage.textContent =
            "Please select a table first.";

        return;
    }


    // Save selected table
    localStorage.setItem("dineInTable", selectedTable);


    // Show order options
    orderChoice.classList.add("show");


    // Update message
    tableMessage.textContent =
        `${selectedTable} selected. What would you like to order?`;

});


// ================= COFFEE =================

coffeeBtn.addEventListener("click", () => {

    // Make sure table is saved
    if (selectedTable) {
        localStorage.setItem("dineInTable", selectedTable);
    }

    // Open Coffee Builder
    window.location.href = "coffee-builder.html";

});


// ================= PASTRY =================

pastryBtn.addEventListener("click", () => {

    // Make sure table is saved
    if (selectedTable) {
        localStorage.setItem("dineInTable", selectedTable);
    }

    // Open Pastry Counter
    window.location.href = "pastry-counter.html";

});