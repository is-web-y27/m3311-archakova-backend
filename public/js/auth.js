'use strict';

const authForm = document.querySelector('[data-auth-form]');

if (authForm) {
  authForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = authForm.querySelector('button[type="submit"]');
    const errorBox = authForm.querySelector('[data-auth-error]');
    const formData = new FormData(authForm);
    const mode = authForm.dataset.authForm;
    const formFields = ['name', 'email', 'password']
      .filter((id) => formData.has(id))
      .map((id) => ({ id, value: String(formData.get(id)) }));

    submitButton.disabled = true;
    errorBox.hidden = true;

    try {
      const response = await fetch(`/auth/${mode}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          rid: 'emailpassword',
        },
        body: JSON.stringify({ formFields }),
      });

      const result = await response.json();

      if (result.status === 'OK') {
        window.location.href = authForm.dataset.returnTo || '/profile';
        return;
      }

      if (result.status === 'FIELD_ERROR') {
        errorBox.textContent = result.formFields.map((field) => field.error).join(' ');
      } else if (result.status === 'WRONG_CREDENTIALS_ERROR') {
        errorBox.textContent = 'Неверная почта или пароль';
      } else if (result.status === 'EMAIL_ALREADY_EXISTS_ERROR') {
        errorBox.textContent = 'Пользователь с такой почтой уже существует';
      } else {
        errorBox.textContent = result.reason || 'Не удалось выполнить запрос';
      }

      errorBox.hidden = false;
    } catch {
      errorBox.textContent = 'Сервис авторизации временно недоступен';
      errorBox.hidden = false;
    } finally {
      submitButton.disabled = false;
    }
  });
}
