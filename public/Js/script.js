// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


// Fillter Icons
const filters = document.querySelectorAll(".filter");
filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.querySelector("p").textContent;
    window.location.href = `/listings/category?filter=${category}`;
  });
});


// Scroll Icons
// let scrollContainer = document.getElementById("filters");
// let backBtn = document.getElementById("backBtn");
// let rightBtn = document.getElementById("rightBtn");

// nextBtn.addEventListener("click", () =>{
//   scrollContainer.style.scrollBehavior = "smooth"
//   scrollContainer.scrollLeft += 100;
// })

// backBtn.addEventListener("click", () =>{
//   scrollContainer.style.scrollBehavior = "smooth"
//   scrollContainer.scrollLeft -= 100;
// })
