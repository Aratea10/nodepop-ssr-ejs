window.onload = function() {
    lucide.createIcons();
    setupEventListeners();
};

const deleteModal = document.getElementById('deleteModal');
const deleteMessage = document.getElementById('deleteMessage');
const confirmDeleteButton = document.querySelector('.confirm-delete-button');
const cancelDeleteButton = document.querySelector('.cancel-delete-button');

let productIdToDelete = null; 
        
function showDeleteModal(productName, productId) {
    productIdToDelete = productId;
    deleteMessage.innerHTML = '¿Estás seguro de que quieres eliminar "<strong>' + productName + '</strong>"? Esta acción es irreversible.';
    deleteModal.classList.remove('hidden');
    lucide.createIcons(); 
}

function hideDeleteModal() {
    deleteModal.classList.add('hidden');
    productIdToDelete = null;
}

async function confirmDelete() {
    if (!productIdToDelete) return;

    try {
        const response = await fetch(`/products/${productIdToDelete}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            window.location.reload();
        } else {
            console.error('Error al eliminar el producto:', response.statusText);
            alert('Hubo un error al eliminar el producto. Inténtalo de nuevo.');
            hideDeleteModal();
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('Hubo un error de red. Verifica tu conexión.');
        hideDeleteModal();
    }
}

function setupEventListeners() {
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const productName = event.currentTarget.dataset.productName;
            const productId = event.currentTarget.dataset.productId;
            showDeleteModal(productName, productId);
        });
    });

    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', confirmDelete);
    }
    if (cancelDeleteButton) {
        cancelDeleteButton.addEventListener('click', hideDeleteModal);
    }
    
    if (deleteModal) {
        deleteModal.addEventListener('click', (event) => {
            if (event.target === deleteModal) {
                hideDeleteModal();
            }
        });
    }
}