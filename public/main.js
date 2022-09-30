
const parseJwt = (token) => {
  let base64Url = token.split('.')[1]
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))

  return JSON.parse(jsonPayload);
}



const enableAddButton = () => {
  document.getElementById('addButton').style.display = 'block'
}

const goToAddSlide = () => {
  window.location.assign("/add")
}

async function initializeSlides() {
  let slides

  const res = await fetch('https://slides.cyclic.app/api/listJson')

  slides = await res.json()

  let container = document.getElementById('main')
  for (let index = 0; index < slides.length; index++) {
    let slide = slides[index].Key
    slide = slide.replace(".json", "")

    let slideContent

    const res = await fetch(`https://slides.cyclic.app/api/files?name=${slide}`)

    slideContent = await res.json()

    let slideId = slideContent['id']
    let slideName = slideContent['name']
    let slideDesc = slideContent['description']
    let slidePrev = slideContent['preview']
    let slidePrice = slideContent['price']
    let slideUrl = slideContent['url']

    console.log(slideId, slideName, slideDesc, slidePrev, slidePrice, slideUrl)
    let button = isAdmin() ? "Edit" : "View"
    let div = document.createElement("div")
    div.classList.add("col");
    div.innerHTML = `
    <div class="card shadow-sm">
    <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg"
      role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
      <title>Placeholder</title>
      <rect width="100%" height="100%" fill="#55595c" />
      <text x="50%" y="50%" fill="#eceeef" dy=".3em">${slidePrev}</text>
    </svg>

    <div class="card-body">
      <p class="card-text"><b>${slideName}</b></br><i>${slideDesc}</i></p>
      <div class="d-flex justify-content-between align-items-center">
        <div class="btn-group">
          <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#slideModal"
          data-bs-name="${slideName}"
          data-bs-desc="${slideDesc}"
          data-bs-preview="${slidePrev}"
          data-bs-price="${slidePrice}">${button}</button>
        </div>
        <small class="text-muted">${slidePrice}</small>
      </div>
    </div>
    `
    container.appendChild(div)
  }
}



const localStorage = window.localStorage

const isAdmin = () => {
  if (parseJwt(localStorage.getItem('token'))['role'] != 'admin')
    return false

  return true
}

if (isAdmin())
  enableAddButton()

initializeSlides()

let slideModal = document.getElementById('slideModal')
slideModal.addEventListener('show.bs.modal', function (event) {
  // Button that triggered the modal
  let button = event.relatedTarget
  // Extract info from data-bs-* attributes
  let slideName = button.getAttribute('data-bs-name')
  let slideDesc = button.getAttribute('data-bs-desc')
  let slidePrev = button.getAttribute('data-bs-preview')
  let slidePrice = button.getAttribute('data-bs-price')

  slideModal.querySelector('.modal-title').textContent = slideName
  slideModal.querySelector('.modal-desc').textContent = slideDesc
  slideModal.querySelector('.modal-price').textContent = slidePrice
})



// const localStorageAsync = {
//   set: function (key, value) {
//       return Promise.resolve().then(function () {
//           localStorage.setItem(key, value)
//       })
//   },
//   get: function (key) {
//       return Promise.resolve().then(function () {
//           return localStorage.getItem(key)
//       })
//   }
// }
