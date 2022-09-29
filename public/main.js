const parseJwt = (token) => {
  let base64Url = token.split('.')[1]
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))

  return JSON.parse(jsonPayload);
}

const isAdmin = () => {
  const JWT = localStorage.getItem('token')
  const role = parseJwt(JWT)['role']

  if (role !== 'admin')
    return false

  return true
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
    let slideModal = `slideModal${slideId}`

    console.log(slideId, slideName, slideDesc, slidePrev, slidePrice, slideUrl)
    let button = isAdmin() ? "Edit" : "View"
    let div = document.createElement("div");
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
          <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="${slideModal}"">${button}</button>
        </div>
        <small class="text-muted">${slidePrice}</small>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="${slideModal}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="${slideModal}Label">Modal title</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
    `
    container.appendChild(div);
  }
}

initializeSlides()
