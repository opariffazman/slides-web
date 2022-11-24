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
    let tajuk = button.getAttribute('data-bs-tajuk')
    let tingkatan = button.getAttribute('data-bs-tingkatan')
    let isi = button.getAttribute('data-bs-isi')
    let subjek = button.getAttribute('data-bs-subjek')
    let price = button.getAttribute('data-bs-price')

    slideModal.querySelector('.modal-tajuk').textContent = tajuk
    slideModal.querySelector('.modal-tingkatan').textContent = tingkatan
    slideModal.querySelector('.modal-isi').textContent = isi
    slideModal.querySelector('.modal-subjek').textContent = subjek
    slideModal.querySelector('.modal-price').textContent = price
  })
}

async function initializeSlides() {
  console.log('initializing slides')

  const res = await fetch('https://slides.cyclic.app/api/listFiles')
  let slides = await res.json()

  isAdmin() ? document.getElementById('addButton').style.display = 'block' : document.getElementById('addButton').style.display = 'none'

  if (slides === null)
    return

  let container = document.getElementById('main')
  for (let index = 0; index < slides.length; index++) {
    let slide = slides[index].Key
    const res = await fetch(`https://slides.cyclic.app/api/files?name=${slide}`)

    let info = await res.json()
    let uid = info['uid']
    let tajuk = info['tajuk']
    let tingkatan = info['tingkatan']
    let subjek = info['subjek'] === 'matematik' ? 'Matematik' : 'Matematik Tambahan'
    let isi = info['isi']
    let price = info['price']
    // let url = info['url']

    // console.log(uid, tajuk, tingkatan, isi, subjek, price, url)
    let div = document.createElement("div")
    div.classList.add("col");
    div.innerHTML = `
      <div class="card shadow-sm">
      <img class="bd-placeholder-img card-img-top" width="100%" height="225" src="presentation.svg" class="img-fluid" alt="...">

      <div class="card-body">
        <div class="d-flex justify-content-between">
          <p class="card-text"><b>Pakej ${tajuk}</b></p>
          <p class="card-text text-muted">${subjek}</p>
        </div>
        <p class="card-text">Tingkatan ${tingkatan}</p>
        <p class="card-text"><i>${isi}</i></p>
        <div class="d-flex justify-content-between align-items-center">
          <button type="button" class="btn btn-secondary">Tambah</button>
          <small class="text-muted">RM ${price}</small>
        </div>
      </div>
      `
    container.appendChild(div)
  }

  // <div class="btn-group">
  //           <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#slideModal"
  //           data-bs-tajuk="${tajuk}"
  //           data-bs-tingkatan="${tingkatan}"
  //           data-bs-isi="${isi}"
  //           data-bs-subjek="${subjek}"
  //           data-bs-price="${price}">View</button>
  //         </div>

  initializeModals()


}



