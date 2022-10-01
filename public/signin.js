const localStorage = window.localStorage

const localStorageAsync = {
  set: function (key, value) {
      return Promise.resolve().then(function () {
          localStorage.setItem(key, value)
      })
  },
  get: function (key) {
      return Promise.resolve().then(function () {
          return localStorage.getItem(key)
      })
  }
}

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
      localStorageAsync.set('token', JSON.stringify(data))
      window.location.assign("/")
    })
    .catch((error) => {
      console.error('Error:', error)
    })

}
