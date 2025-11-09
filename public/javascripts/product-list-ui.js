document.addEventListener('DOMContentLoaded', function () {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  const deleteModal = document.getElementById('deleteModal');
  const deleteMessage = document.getElementById('deleteMessage');
  let productIdToDelete = null;

  function showDeleteModal(productName, productId) {
    if (!deleteModal || !deleteMessage) return;

    productIdToDelete = productId;
    deleteMessage.innerHTML =
      '¿Estás seguro de que quieres eliminar "' + productName + '"? Esta acción es irreversible.';
    deleteModal.classList.remove('hidden');

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  function hideDeleteModal() {
    if (!deleteModal) return;
    deleteModal.classList.add('hidden');
    productIdToDelete = null;
  }

  function confirmDelete() {
    if (productIdToDelete) {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/products/' + productIdToDelete + '/delete';
      document.body.appendChild(form);
      form.submit();
    }
    hideDeleteModal();
  }

  document.body.addEventListener('click', function (event) {
    if (event.target.matches('.delete-button')) {
      const button = event.target;
      const productName = button.getAttribute('data-product-name');
      const productId = button.getAttribute('data-product-id');
      showDeleteModal(productName, productId);
    }

    if (event.target.matches('.confirm-delete-button')) {
      confirmDelete();
    }

    if (event.target.matches('.cancel-delete-button')) {
      hideDeleteModal();
    }
  });
});
