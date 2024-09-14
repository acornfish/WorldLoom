import '/global.js'
import '../libs/jquery.min.js'

$(".export-button").on("click", () => {
    window.saveData();
    setTimeout(() => {
        window.location = '/db.json'
    }, 1000)
    window.showToast("Exporting...", "info", 1000)
})

$(".export-html-button").on("click", () => {
    window.saveData();
    window.open("/api/exportProject?Project=" + localStorage.getItem("CurrentProject"))
    window.showToast("Exporting...", "info", 1000)
})

$(".import-button").on("click", () => {
    $(".import-popup").fadeIn(0)
})

$(".import").on("click", () => {
    $.ajax({
      type: "POST",
      url: "/api/importDatabase",
      data: ($("#import-textarea").val()),
      contentType: 'text/plain',
      success: (res) => {
        window.showToast("Successfuly imported", "success", 1000)
        setTimeout(() => {window.location = window.location + '?i'}, 1000)
      },
      error: (jqXHR, textStatus, errorThrown) => {
        window.showToast("Failed to import", "danger", 2000)
      }
  })
})