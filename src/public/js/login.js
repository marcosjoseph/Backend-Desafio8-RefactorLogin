//creamos una funcion que vaya a crear el usuario en la base de datos de Mongo

async function postLogin (email, password) {
    const data = {email, password};

    const response = await fetch ("/api/login", {
        method:"POST",
        headers: {"Content-Type":"application/json",},
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.respuesta === "Ok") {
        window.location.href = "/api/products";
    } else { alert("Datos Incorrectos")}
}

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const result = await postLogin(email, password);
})