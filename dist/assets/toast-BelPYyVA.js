const showToast = (message = "Sample Message", toastType = "info", duration = 5e3) => {
  let icon = {
    success: '<i class="fa-solid fa-check"></i>',
    danger: '<i class="fa-solid fa-circle-exclamation"></i>',
    warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
    info: '<i class="fa-solid fa-circle-question"></i>'
  };
  if (!Object.keys(icon).includes(toastType))
    toastType = "info";
  let box = document.createElement("div");
  box.classList.add(
    "toast",
    `toast-${toastType}`
  );
  box.innerHTML = ` <div class="toast-content-wrapper">
                      <div class="toast-icon">
                      ${icon[toastType]}
                      </div>
                      <div class="toast-message">${message}</div>
                      <div class="toast-progress"></div>
                      </div>`;
  duration = duration || 5e3;
  box.querySelector(".toast-progress").style.animationDuration = `${duration / 1e3}s`;
  let toastAlready = document.body.querySelector(".toast");
  if (toastAlready) {
    toastAlready.remove();
  }
  document.body.appendChild(box);
};
export {
  showToast as s
};
