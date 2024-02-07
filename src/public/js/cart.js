//get cart from params
let URLactual = window.location;
let URL = URLactual.toString();
let URLsplit = URL.split("/");

let cartId = URLsplit[URLsplit.length - 1];
console.log(cartId);

async function minus(pid) {
    console.log("productID:", pid);

    const URL = `/api/carts/${cartId}/product/${pid}`;
    console.log(URL);

    const response = await fetch(`${URL}`, {
    method: "DELETE",
    });
    const data = await response.json();
    console.log(data);
    window.location.reload();
}

async function plus(pid) {
    console.log("productID:", pid);

    const URL = `/api/carts/${cartId}/product/${pid}`;
    console.log(URL);

    const response = await fetch(`${URL}`, {
    method: "PUT",
    });
    const data = await response.json();
    console.log(data)
    window.location.reload();
}