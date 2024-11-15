document.addEventListener("DOMContentLoaded", function() {
  const openFormBtn = document.getElementById("openFormBtn");
  const popupOverlay = document.getElementById("popupOverlay");
  const feedbackForm = document.getElementById("feedbackForm");
  const responseMessage = document.getElementById("responseMessage");

  // Показать попап и обновить URL
  openFormBtn.addEventListener("click", function() {
    openPopup();
    history.pushState({ formOpened: true }, "", "#feedbackForm");
  });

  // Закрыть попап и вернуться к основному URL
  function closePopup() {
    popupOverlay.style.display = "none";
    history.back();
  }

  function openPopup() {
    popupOverlay.style.display = "flex";
    restoreFormData();
  }

  // Обработка клика вне формы для закрытия попапа
  popupOverlay.addEventListener("click", function(event) {
    if (event.target === popupOverlay) closePopup();
  });

  // Сохранить данные формы в LocalStorage
  function saveFormData() {
    const formData = new FormData(feedbackForm);
    const formValues = Object.fromEntries(formData);
    localStorage.setItem("feedbackFormData", JSON.stringify(formValues));
  }

  // Восстановить данные формы из LocalStorage
  function restoreFormData() {
    const savedData = localStorage.getItem("feedbackFormData");
    if (savedData) {
      const formValues = JSON.parse(savedData);
      Object.entries(formValues).forEach(([name, value]) => {
        const field = feedbackForm.elements[name];
        if (field) field.value = value;
      });
    }
  }

  // Отправка формы с использованием fetch
  feedbackForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    const formData = new FormData(feedbackForm);

    // Отправка данных на сервер (пример с formcarry.com)
    try {
      const response = await fetch("https://formcarry.com/s/YOUR_FORM_ID", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        responseMessage.textContent = "Сообщение успешно отправлено!";
        localStorage.removeItem("feedbackFormData");
        feedbackForm.reset();
      } else {
        responseMessage.textContent = "Ошибка при отправке сообщения. Попробуйте позже.";
      }
    } catch (error) {
      responseMessage.textContent = "Ошибка при отправке сообщения.";
    }
  });

  // Сохранить введенные данные перед отправкой
  feedbackForm.addEventListener("input", saveFormData);

  // Управление состоянием истории
  window.addEventListener("popstate", function(event) {
    if (!event.state?.formOpened) closePopup();
  });
});
