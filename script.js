document.addEventListener("DOMContentLoaded", function() {
  const openFormBtn = document.getElementById("openFormBtn");
  const popupOverlay = document.getElementById("popupOverlay");
  const feedbackForm = document.getElementById("feedbackForm");
  const responseMessage = document.getElementById("responseMessage");

  // �������� ����� � �������� URL
  openFormBtn.addEventListener("click", function() {
    openPopup();
    history.pushState({ formOpened: true }, "", "#feedbackForm");
  });

  // ������� ����� � ��������� � ��������� URL
  function closePopup() {
    popupOverlay.style.display = "none";
    history.back();
  }

  function openPopup() {
    popupOverlay.style.display = "flex";
    restoreFormData();
  }

  // ��������� ����� ��� ����� ��� �������� ������
  popupOverlay.addEventListener("click", function(event) {
    if (event.target === popupOverlay) closePopup();
  });

  // ��������� ������ ����� � LocalStorage
  function saveFormData() {
    const formData = new FormData(feedbackForm);
    const formValues = Object.fromEntries(formData);
    localStorage.setItem("feedbackFormData", JSON.stringify(formValues));
  }

  // ������������ ������ ����� �� LocalStorage
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

  // �������� ����� � �������������� fetch
  feedbackForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    const formData = new FormData(feedbackForm);

    // �������� ������ �� ������ (������ � formcarry.com)
    try {
      const response = await fetch("https://formcarry.com/s/YOUR_FORM_ID", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        responseMessage.textContent = "��������� ������� ����������!";
        localStorage.removeItem("feedbackFormData");
        feedbackForm.reset();
      } else {
        responseMessage.textContent = "������ ��� �������� ���������. ���������� �����.";
      }
    } catch (error) {
      responseMessage.textContent = "������ ��� �������� ���������.";
    }
  });

  // ��������� ��������� ������ ����� ���������
  feedbackForm.addEventListener("input", saveFormData);

  // ���������� ���������� �������
  window.addEventListener("popstate", function(event) {
    if (!event.state?.formOpened) closePopup();
  });
});
