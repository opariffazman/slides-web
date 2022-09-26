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
          <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
        </div>
        <small class="text-muted">${slidePrice}</small>
      </div>
    </div>

    </div>
    `
    container.appendChild(div);
  }
}

initializeSlides()
