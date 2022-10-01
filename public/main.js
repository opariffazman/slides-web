const localStorage = window.localStorage

const goToAddSlide = () => {
  window.location.assign("/add")
}

const parseJwt = (token) => {
  let base64Url = token.split('.')[1]
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))

  return JSON.parse(jsonPayload);
}

const isAdmin = () => {
  if (localStorage.getItem('token') === null)
    return false

  if (parseJwt(localStorage.getItem('token'))['role'] !== 'admin')
    return false

  console.log('isAdmin() true')
  return true
}

const initializeModals = () => {
  let slideModal = document.getElementById('slideModal')
  slideModal.addEventListener('show.bs.modal', function (event) {
    // Button that triggered the modal
    let button = event.relatedTarget
    // Extract info from data-bs-* attributes
    let packageTajuk = button.getAttribute('data-bs-tajuk')
    let packageTingkatan = button.getAttribute('data-bs-tingkatan')
    let packageIsi = button.getAttribute('data-bs-isi')
    let packageSubjek = button.getAttribute('data-bs-subjek')
    let packagePrice = button.getAttribute('data-bs-price')

    slideModal.querySelector('.modal-tajuk').textContent = packageTajuk
    slideModal.querySelector('.modal-tingkatan').textContent = packageTingkatan
    slideModal.querySelector('.modal-isi').textContent = packageIsi
    slideModal.querySelector('.modal-subjek').textContent = packageSubjek
    slideModal.querySelector('.modal-price').textContent = packagePrice
  })
}

async function initializeSlides() {
  console.log('initializing slides')
  let slides

  const res = await fetch('https://slides.cyclic.app/api/listPackage')

  slides = await res.json()

  let container = document.getElementById('main')
  for (let index = 0; index < slides.length; index++) {
    let slide = slides[index].Key
    slide = slide.replace(".json", "")

    const res = await fetch(`https://slides.cyclic.app/api/files?name=${slide}`)

    let packageInfo = await res.json()

    let packageId = packageInfo['uid']
    let packageTajuk = packageInfo['tajuk']
    let packageTingkatan = packageInfo['tingkatan']
    let packageSubjek = packageInfo['subjek']
    let packageIsi = packageInfo['isi']
    let packagePrice = packageInfo['price']
    let packageUrl = packageInfo['url']

    console.log(packageId, packageTajuk, packageTingkatan, packageIsi, packageSubjek, packagePrice, packageUrl)
    let button = isAdmin() ? "Edit" : "View"
    let div = document.createElement("div")
    div.classList.add("col");
    div.innerHTML = `
      <div class="card shadow-sm">
      <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg"
        role="img" aria-label="${packageTajuk}" preserveAspectRatio="xMidYMid slice" focusable="false">
        <title>Placeholder</title>
        <rect width="100%" height="100%" fill="#55595c" />
        <text x="50%" y="50%" fill="#eceeef" dy=".3em">${packageTajuk}</text>
      </svg>

      <div class="card-body">
        <p class="card-text"><b>${packageTajuk}</b></br><i>${packageIsi}</i></p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#slideModal"
            data-bs-tajuk="${packageTajuk}"
            data-bs-tingkatan="${packageTingkatan}"
            data-bs-isi="${packageIsi}"
            data-bs-subjek="${packageSubjek}"
            data-bs-price="${packagePrice}">${button}</button>
          </div>
          <small class="text-muted">${packagePrice}</small>
        </div>
      </div>
      `
    container.appendChild(div)
  }

  initializeModals()

}

if (isAdmin())
  document.getElementById('addButton').style.display = 'block'

document.getElementById('addButton').style.display = 'none'

