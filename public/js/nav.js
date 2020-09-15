window.$ = window.jQuery = require('./public/js/jquery-3.5.1.min.js')


document.body.addEventListener('click', (event) => {
    
    if (event.target.dataset.section) {
      handleSectionTrigger(event)
    } else if (event.target.dataset.modal) {
      handleModalTrigger(event)
    } else if (event.target.classList.contains('modal-hide')) {
      hideAllModals()
    }
})
