let isEditing = false;
let editingRow;

// Load inventory from local storage
function loadInventory() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const inventoryTableBody = document.querySelector('#inventoryTable tbody');

    inventory.forEach(item => {
        addRowToTable(item.id, item.name, item.quantity, item.price, inventoryTableBody);
    });
}

// Add item to the table and local storage
function addItem() {
    const idInput = document.getElementById('id');
    const nameInput = document.getElementById('name');
    const quantityInput = document.getElementById('quantity');
    const priceInput = document.getElementById('price');
    const inventoryTableBody = document.querySelector('#inventoryTable tbody');

    const itemId = idInput.value.trim();
    const itemName = nameInput.value.trim();
    const itemQuantity = parseInt(quantityInput.value.trim());
    const itemPrice = parseFloat(priceInput.value.trim());

    // Validate unique ID
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const exists = inventory.some(item => item.id === itemId);

    if (itemId && itemName && itemQuantity > 0 && itemPrice >= 0) {
        if (exists) {
            alert('Item ID must be unique!');
            return;
        }
        if (isEditing) {
            // Update the existing row
            editingRow.cells[0].textContent = itemId;
            editingRow.cells[1].textContent = itemName;
            editingRow.cells[2].textContent = itemQuantity;
            editingRow.cells[3].textContent = `$${itemPrice.toFixed(2)}`;
            isEditing = false; // Reset editing state
        } else {
            // Create a new row
            addRowToTable(itemId, itemName, itemQuantity, itemPrice, inventoryTableBody);
        }

        // Update local storage
        saveToLocalStorage();

        // Clear input fields
        idInput.value = '';
        nameInput.value = '';
        quantityInput.value = '';
        priceInput.value = '';
    } else {
        alert('Please enter valid values for ID, Name, Quantity, and Price.');
    }
}

// Function to add a row to the table
function addRowToTable(itemId, itemName, itemQuantity, itemPrice, tableBody) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${itemId}</td>
        <td>${itemName}</td>
        <td>
            <button onclick="changeQuantity(this, 1)">+</button>
            <span>${itemQuantity}</span>
            <button onclick="changeQuantity(this, -1)">-</button>
        </td>
        <td>$${itemPrice.toFixed(2)}</td>
        <td>
            <button onclick="editItem(this)">Edit</button>
            <button onclick="removeItem(this)">Remove</button>
        </td>
    `;
    tableBody.appendChild(newRow);
}

// Change quantity
function changeQuantity(button, change) {
    const row = button.parentElement.parentElement;
    const quantityCell = row.cells[2].querySelector('span');
    let quantity = parseInt(quantityCell.textContent);
    
    quantity += change;
    if (quantity < 0) quantity = 0; // Prevent negative quantity
    quantityCell.textContent = quantity;

    // Update local storage
    saveToLocalStorage();
}

// Edit item
function editItem(button) {
    const row = button.parentElement.parentElement;
    const cells = row.getElementsByTagName('td');

    document.getElementById('id').value = cells[0].textContent;
    document.getElementById('name').value = cells[1].textContent;
    document.getElementById('quantity').value = cells[2].querySelector('span').textContent;
    document.getElementById('price').value = parseFloat(cells[3].textContent.replace('$', '')).toFixed(2);

    editingRow = row; // Store the row being edited
    isEditing = true; // Set editing mode
}

// Remove item
function removeItem(button) {
    const row = button.parentElement.parentElement;
    row.parentElement.removeChild(row);
    
    // Update local storage
    saveToLocalStorage();
}

// Clear all items
function clearAllItems() {
    const inventoryTableBody = document.querySelector('#inventoryTable tbody');
    inventoryTableBody.innerHTML = ''; // Clear the table
    localStorage.removeItem('inventory'); // Clear local storage
}

// Search items
function searchItems() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const rows = document.querySelectorAll('#inventoryTable tbody tr');

    rows.forEach(row => {
        const itemId = row.cells[0].textContent.toLowerCase();
        const itemName = row.cells[1].textContent.toLowerCase();

        if (itemId.includes(searchInput) || itemName.includes(searchInput)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Save inventory to local storage
function saveToLocalStorage() {
    const inventory = [];
    const rows = document.querySelectorAll('#inventoryTable tbody tr');

    rows.forEach(row => {
        const itemId = row.cells[0].textContent;
        const itemName = row.cells[1].textContent;
        const itemQuantity = row.cells[2].querySelector('span').textContent;
        const itemPrice = row.cells[3].textContent.replace('$', '');
        
        inventory.push({ id: itemId, name: itemName, quantity: itemQuantity, price: parseFloat(itemPrice) });
    });

    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// Load inventory on page load
window.onload = loadInventory;
