const localStorage = window.localStorage

const generateUID = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

const addSlide = () => {
  const uid = generateUID()
  const tajuk = document.getElementById("tajuk").value
  const tingkatan = document.getElementById("tingkatan").value
  const subjek = document.getElementById("subjek").value
  const isi = document.getElementById("isi").value
  const price = document.getElementById("price").value
  const url = document.getElementById("url").value

  const data = {
    uid: uid,
    tajuk: tajuk,
    tingkatan: tingkatan,
    subjek: subjek,
    isi: isi,
    price: price,
    url: url
  }

  const accessToken = JSON.parse(localStorage.getItem('token'))['accessToken']
  fetch(`https://slides.cyclic.app/api/files?name=package${uid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data)
    })
    .catch((error) => {
      console.error('Error:', error)
    })

  // window.location.assign("/")
}
