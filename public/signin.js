const signIn = () => {
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  const data = {
    username: username,
    password: password
  }

  fetch('https://slides.cyclic.app/api/signin', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data)
      localStorage.setItem('token', JSON.stringify(data))
    })
    .catch((error) => {
      console.error('Error:', error)
    })

  window.location.assign("https://slides-web.cyclic.app")
}
