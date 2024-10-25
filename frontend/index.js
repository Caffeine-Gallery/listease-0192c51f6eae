import { backend } from "declarations/backend";

const itemInput = document.getElementById('item-input');
const addItemForm = document.getElementById('add-item-form');
const shoppingList = document.getElementById('shopping-list');
const loading = document.getElementById('loading');

// Show/hide loading spinner
const toggleLoading = (show) => {
    loading.classList.toggle('d-none', !show);
};

// Render a single shopping item
const renderItem = (item) => {
    const li = document.createElement('li');
    li.className = `list-group-item d-flex justify-content-between align-items-center ${item.completed ? 'completed' : ''}`;
    
    const textSpan = document.createElement('span');
    textSpan.className = 'item-text';
    textSpan.textContent = item.text;
    
    const buttonsDiv = document.createElement('div');
    
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn btn-sm btn-success me-2';
    toggleBtn.innerHTML = `<i class="fas fa-check"></i>`;
    toggleBtn.onclick = () => toggleItem(item.id);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm btn-danger';
    deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
    deleteBtn.onclick = () => deleteItem(item.id);
    
    buttonsDiv.appendChild(toggleBtn);
    buttonsDiv.appendChild(deleteBtn);
    
    li.appendChild(textSpan);
    li.appendChild(buttonsDiv);
    
    return li;
};

// Load and render all items
const loadItems = async () => {
    try {
        toggleLoading(true);
        const items = await backend.getAllItems();
        shoppingList.innerHTML = '';
        items.forEach(item => {
            shoppingList.appendChild(renderItem(item));
        });
    } catch (error) {
        console.error('Error loading items:', error);
    } finally {
        toggleLoading(false);
    }
};

// Add new item
const addItem = async (text) => {
    try {
        toggleLoading(true);
        await backend.addItem(text);
        await loadItems();
        itemInput.value = '';
    } catch (error) {
        console.error('Error adding item:', error);
    } finally {
        toggleLoading(false);
    }
};

// Toggle item completion
const toggleItem = async (id) => {
    try {
        toggleLoading(true);
        await backend.toggleItem(id);
        await loadItems();
    } catch (error) {
        console.error('Error toggling item:', error);
    } finally {
        toggleLoading(false);
    }
};

// Delete item
const deleteItem = async (id) => {
    try {
        toggleLoading(true);
        await backend.deleteItem(id);
        await loadItems();
    } catch (error) {
        console.error('Error deleting item:', error);
    } finally {
        toggleLoading(false);
    }
};

// Event Listeners
addItemForm.onsubmit = (e) => {
    e.preventDefault();
    const text = itemInput.value.trim();
    if (text) {
        addItem(text);
    }
};

// Initial load
window.onload = loadItems;
