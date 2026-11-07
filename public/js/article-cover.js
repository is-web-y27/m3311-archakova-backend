'use strict';

document.querySelectorAll('.cover-form').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const articleId = form.dataset.articleId;
    const formData = new FormData(form);

    const response = await fetch(`/api/articles/${articleId}/cover`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      alert('Не удалось загрузить обложку');
      return;
    }

    window.location.reload();
  });
});