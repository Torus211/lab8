document.addEventListener("DOMContentLoaded", function() {
  const openFormBtn = document.getElementById("openFormBtn");
  const popupOverlay = document.getElementById("popupOverlay");
  const feedbackForm = document.getElementById("feedbackForm");
  const responseMessage = document.getElementById("responseMessage");

  // Ïîêàçàòü ïîïàï è îáíîâèòü URL
  openFormBtn.addEventListener("click", function() {
    openPopup();
    history.pushState({ formOpened: true }, "", "#feedbackForm");
  });

  // Çàêðûòü ïîïàï è âåðíóòüñÿ ê îñíîâíîìó URL
  function closePopup() {
    popupOverlay.style.display = "none";
    history.back();
  }

  function openPopup() {
    popupOverlay.style.display = "flex";
    restoreFormData();
  }

  // Îáðàáîòêà êëèêà âíå ôîðìû äëÿ çàêðûòèÿ ïîïàïà
  popupOverlay.addEventListener("click", function(event) {
    if (event.target === popupOverlay) closePopup();
  });

  // Ñîõðàíèòü äàííûå ôîðìû â LocalStorage
  function saveFormData() {
    const formData = new FormData(feedbackForm);
    const formValues = Object.fromEntries(formData);
    localStorage.setItem("feedbackFormData", JSON.stringify(formValues));
  }

  // Âîññòàíîâèòü äàííûå ôîðìû èç LocalStorage
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

  // Îòïðàâêà ôîðìû ñ èñïîëüçîâàíèåì fetch
  feedbackForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    const formData = new FormData(feedbackForm);

    // Îòïðàâêà äàííûõ íà ñåðâåð (ïðèìåð ñ formcarry.com)
    try {
      const response = await fetch("https://formcarry.com/s/lyXlPAUfGqv", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        responseMessage.textContent = "Форма отправлена";
        localStorage.removeItem("feedbackFormData");
        feedbackForm.reset();
      } else {
        responseMessage.textContent = "форма не отправлена";
      }
    } catch (error) {
      responseMessage.textContent = "форма отправлена.";
    }
  });

  // Ñîõðàíèòü ââåäåííûå äàííûå ïåðåä îòïðàâêîé
  feedbackForm.addEventListener("input", saveFormData);

  // Óïðàâëåíèå ñîñòîÿíèåì èñòîðèè
  window.addEventListener("popstate", function(event) {
    if (!event.state?.formOpened) closePopup();
  });
});
