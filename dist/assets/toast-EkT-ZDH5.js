const c=(t="Sample Message",s="info",e=5e3)=>{let i={success:'<i class="fa-solid fa-check"></i>',danger:'<i class="fa-solid fa-circle-exclamation"></i>',warning:'<i class="fa-solid fa-triangle-exclamation"></i>',info:'<i class="fa-solid fa-circle-question"></i>'};Object.keys(i).includes(s)||(s="info");let a=document.createElement("div");a.classList.add("toast",`toast-${s}`),a.innerHTML=` <div class="toast-content-wrapper">
                      <div class="toast-icon">
                      ${i[s]}
                      </div>
                      <div class="toast-message">${t}</div>
                      <div class="toast-progress"></div>
                      </div>`,e=e||5e3,a.querySelector(".toast-progress").style.animationDuration=`${e/1e3}s`;let o=document.body.querySelector(".toast");o&&o.remove(),document.body.appendChild(a)};export{c as s};
