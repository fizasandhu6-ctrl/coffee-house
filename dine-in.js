// ================= DINE IN TABLE SELECTION =================

const tables = document.querySelectorAll(".table-card");
const selectedTableText = document.getElementById("selectedTable");
const continueBtn = document.getElementById("continueBtn");
const tableMessage = document.getElementById("tableMessage");

let selectedTable = null;


// ================= SELECT TABLE =================

tables.forEach(table => {

    table.addEventListener("click", () => {

        // Remove selection from all tables
        tables.forEach(item => {
            item.classList.remove("selected");
        });

        // Select clicked table
        table.classList.add("selected");

        // Get table name
        selectedTable = table.dataset.table;

        // Show selected table
        selectedTableText.textContent = selectedTable;

        // Enable Continue button
        continueBtn.disabled = false;

        // Clear previous message
        tableMessage.textContent = "";

    });

});


// ================= CONTINUE =================

continueBtn.addEventListener("click", () => {

    if (!selectedTable) {
        tableMessage.textContent = "Please select a table first.";
        return;
    }

    // Save selected table
    localStorage.setItem("dineInTable", selectedTable);

    tableMessage.textContent =
        `${selectedTable} selected successfully!`;

    console.log("Dine-in table:", selectedTable);

});