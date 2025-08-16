
/*
    Worldloom
    Copyright (C) 2025 Ege Açıkgöz

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, version 3 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/    


import '../libs/jquery.min.js'
import "../libs/select2.min.js"
import '/global.js'

$(".export-button").on("click", () => {
    window.saveData();
    setTimeout(() => {
        window.location = '/db.json'
    }, 1000)
    window.showToast("Exporting...", "info", 1000)
})

$(".export-html-button").on("click", () => {
    window.saveData();
    window.open("/api/exportProject?project=" + localStorage.getItem("CurrentProject"))
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

if(localStorage.getItem("TextAnalyticsLanguage")){
  $(".text-analytics-language").val(localStorage.getItem("TextAnalyticsLanguage"))
}

$(".text-analytics-language").select2()

$(".text-analytics-language").on("select2:select", (e) => {
  localStorage.setItem("TextAnalyticsLanguage", $(e.currentTarget).val());
})