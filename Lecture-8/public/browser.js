document.addEventListener("click", function (event) {
  //EDIT
  if (event.target.classList.contains("edit-me")) {
    const id = event.target.getAttribute("data-id");
    const newData = prompt("Enter new todo text");
    console.log(id, newData);

    axios
      .post("/edit-item", { id, newData })
      .then((res) => {
        if (res.data.status !== 200) {
          alert(res.data.message);
          return;
        }

        event.target.parentElement.parentElement.querySelector(
          ".item-text"
        ).innerHTML = newData;

        return;
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  }
  //delte
  else if (event.target.classList.contains("delete-me")) {
    console.log(event.target.getAttribute("data-id"));
    const id = event.target.getAttribute("data-id");

    axios
      .post("/delete-item", { id })
      .then((res) => {
        console.log(res);
        if (res.data.status !== 200) {
          alert(res.data.message);
          return;
        }
        event.target.parentElement.parentElement.remove();
      })
      .catch((err) => {
        alert(err);
      });
  }
  //add todo
  else if (event.target.classList.contains("add_item")) {
    // event.preventDefault();
    const todoText = document.getElementById("create_field").value;
    console.log(todoText);
    axios
      .post("/create-item", { todo: todoText })
      .then((res) => {
        console.log(res);
        if (res.data.status !== 201) {
          alert(res.data.message);
          return;
        }

        document.getElementById("create_field").value = "";

        document.getElementById("item_list").insertAdjacentHTML(
          "beforeend",
          `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                <span class="item-text"> ${res.data.data.todo}</span>
                <div>
                <button data-id="${res.data.data._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                <button data-id="${res.data.data._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
        </li>`
        );

        return;
      })
      .catch((err) => {
        alert(err);
      });
  }
});

window.onload = genrateTodos();

function genrateTodos() {
  axios
    .get("/read-item")
    .then((res) => {
      console.log(res);
      if (res.data.status !== 200) {
        alert(res.data.message);
      }
      const todos = res.data.data;

      document.getElementById("item_list").insertAdjacentHTML(
        "beforeend",
        todos
          .map((item) => {
            return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text"> ${item.todo}</span>
            <div>
            <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
            <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
    </li>`;
          })
          .join("")
      );

      return;
    })
    .catch((err) => {
      console.log(err);
      return;
    });
}

//client (axios.get('/read-item'))

//backend app.get('/read-item)

//if env === dev

//client(3000)<--------->server(8000)
//axios(`url/read-item`)

//server(client(8000))
// /read-item
