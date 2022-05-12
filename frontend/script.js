const HOST = "localhost"
const PORT = 3000
const PROTOCOL = "http"

let profiles
let directions
let localUserInfo = {
  "user_directions": [],
  "profile_user": []
}
let chooseFirstStart = true
let choosenDirections = []

const form = document.getElementById("form");
const search = document.getElementById("search");
const catalog = document.getElementById("catalog");
const choose = document.getElementById("choose");
const entry = document.getElementById("search");

const get_all_directions_url = `${PROTOCOL}://${HOST}:${PORT}/api/directions`
const get_all_profiles_url = `${PROTOCOL}://${HOST}:${PORT}/api/profiles`
const get_profiles_url = (id) =>  `${PROTOCOL}://${HOST}:${PORT}/api/profiles/${id}`
const get_user_info_url = (username) => `${PROTOCOL}://${HOST}:${PORT}/api/info/${username}`
const post_user_data = `${PROTOCOL}://${HOST}:${PORT}/api/save`

async function get_all_directions () {
    const resp = await fetch(get_all_directions_url, { origin: "cors" });
    const respData = await resp.json();
    const data = respData["result"]["data"]

    return data
}
async function get_all_profiles () {
    const resp = await fetch(get_all_profiles_url, { origin: "cors" });
    const respData = await resp.json();
    const data = respData["result"]["data"]

    return data
}
async function get_profiles (id) {
    const resp = await fetch(get_profiles_url(id), { origin: "cors" });
    const respData = await resp.json();
    const data = respData["result"]["data"]

    return data
}
async function get_user_info (username) {
    const resp = await fetch(get_user_info_url(username), { origin: "cors" });
    const respData = await resp.json();
    const data = respData["result"]

    return data
}

async function createPost(data) {
  await fetch(post_user_data, {
    method: 'POST',
    mode: 'no-cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      "content-type": "application/json; charset=utf-8",
      "Content-Length": post_user_data.length,
      "Host": `${HOST}:${PORT}`,
      "User-Agent": "PostmanRuntime/7.29.0",
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Connection": "keep-alive"
    },
    redirect: 'follow',
    // body: { "data": data }
    body: JSON.stringify(data) 
  })
    .then(console.log)
}

function addProfile (elem, htmlClass, html) {
  const div = document.createElement("div");
  div.classList.add(htmlClass);
  div.innerHTML = html

  elem.appendChild(div)
}

function clear_choose () {
  choose.innerHTML = `<h2>Выберите направление</h2>
  <p>В левой колонке нажмите на напраление, чтобы добавить в каталог.</p>`;
  chooseFirstStart = true
  choosenDirections = []
  localUserInfo = {
    "user_directions": [],
    "profile_user": []
  }
}

async function main () {
  directions = await get_all_directions()
  profiles = await get_all_profiles()

  addDirectionsToCatalog()
  addProfilesToDirections()

}

async function addDirectionsToCatalog () {
  catalog.innerHTML = "";

  directions.forEach(element => {
    const item = document.createElement("div");
    item.classList.add("direction");
    item.classList.add("border");
    item.classList.add("border-primary");
    item.classList.add("rounded");
    item.classList.add("p-3");

    item.innerHTML = `
    <button class="profile" id="direction_${element["id"]}" onclick="addToCatalog(${element["id"]})">
        <h3>${element["name"]}</h3>
    </button>
    `;

    catalog.appendChild(item);
  });
}

async function addProfilesToDirections () {
  profiles.forEach(profile => {
      const direction = document.getElementById(`direction_${profile["direction_id"]}`);
      const html = `<p id="direction_${profile["direction_id"]}">${profile["name"]}</p>`;

      addProfile(direction, "profile_inner", html)
  })
}

function addToCatalog(id) {
  if (chooseFirstStart) {
    choose.innerHTML = "";
    chooseFirstStart = false
  }

  // check an "id" is in the array
  if (choosenDirections.some(item => item === id)) {
    return
  }

  choosenDirections.push(id)

  let last_priority
  if(localUserInfo["user_directions"].length == 0) last_priority = 0
  else last_priority = localUserInfo["user_directions"].length

  localUserInfo["user_directions"].push({
    "id": id,
    "direction_id": id,
    "priority": last_priority,
    "createdAt": new Date(Date.now()+(1000*60*(-(new Date()).getTimezoneOffset()))).toISOString().replace('T',' ').replace('Z',''),
    "updatedAt": new Date(Date.now()+(1000*60*(-(new Date()).getTimezoneOffset()))).toISOString().replace('T',' ').replace('Z',''),
  })

  let priority_counter = 0
  profiles.forEach(profile => {
    if(profile["direction_id"] == id) {
      localUserInfo["profile_user"].push({
        "id": profile.id,
        "profile_id": profile.id,
        "direction_id": profile.direction_id,
        "priority": priority_counter,
        "createdAt": new Date(Date.now()+(1000*60*(-(new Date()).getTimezoneOffset()))).toISOString().replace('T',' ').replace('Z',''),
        "updatedAt": new Date(Date.now()+(1000*60*(-(new Date()).getTimezoneOffset()))).toISOString().replace('T',' ').replace('Z',''),
      })
      priority_counter++
    }
  })

  structure()
}

function move_direction(priority, course) {
  const arr = localUserInfo["user_directions"]
  let helper

  if (course == "up") {
    helper = arr[priority - 1]["priority"]
    arr[priority - 1]["priority"] = arr[priority]["priority"]
    arr[priority]["priority"] = helper
  }
  else {
    helper = arr[priority + 1]["priority"]
    arr[priority + 1]["priority"] = arr[priority]["priority"]
    arr[priority]["priority"] = helper
  }

  structure()
}

function move_profile (direction_id, priority, course) {
  if (course == "up") {
    let obj_1 = localUserInfo["profile_user"].find(o => o.priority == priority - 1 && o.direction_id == direction_id);
    let obj_2 = localUserInfo["profile_user"].find(o => o.priority == priority && o.direction_id == direction_id);

    localUserInfo["profile_user"].find(o => o.id == obj_1.id)["priority"] = priority
    localUserInfo["profile_user"].find(o => o.id == obj_2.id)["priority"] = priority - 1
  } else {
    let obj_1 = localUserInfo["profile_user"].find(o => o.priority == priority && o.direction_id == direction_id);
    let obj_2 = localUserInfo["profile_user"].find(o => o.priority == priority + 1 && o.direction_id == direction_id);

    localUserInfo["profile_user"].find(o => o.id == obj_1.id)["priority"] = priority + 1
    localUserInfo["profile_user"].find(o => o.id == obj_2.id)["priority"] = priority
  }

  structure()
}

function structure() {
  choose.innerHTML = "";
  chooseFirstStart = false

  // sorting
  localUserInfo["user_directions"].sort((a, b) => {
    return a.priority - b.priority
  })
  localUserInfo["profile_user"].sort((a, b) => {
    return a.priority - b.priority
  })

  // directions
  localUserInfo["user_directions"].forEach(elem => {
    const item = document.createElement("div");
    item.classList.add("direction");

    let arrows_d
    if (elem["priority"] == 0 && choosenDirections.length !== 1) {
      arrows_d = `<div class="column">
      <button class="down" onclick="move_direction(${elem["priority"]}, 'down')">↓</button></div>`
    }
    else if (elem["priority"] == choosenDirections.length - 1 && choosenDirections.length > 1) {
      arrows_d =  `<div class="column">
                <button class="up" onclick="move_direction(${elem["priority"]}, 'up')">↑</button></div>`
    }
    else if (choosenDirections.length > 1) {
      arrows_d =  `<div class="column">
                <button class="up" onclick="move_direction(${elem["priority"]}, 'up')">↑</button>
                <button class="down" onclick="move_direction(${elem["priority"]}, 'down')">↓</button></div>`
    }
    else {
      arrows_d = ''
    }


    item.innerHTML = `
    <div>
      ${arrows_d}
      <button class="profile">
        <h3>${directions[parseInt(elem["direction_id"], 10)]["name"]}</h3>
      </button>
    </div>
    `;
    
    choose.appendChild(item);

    // profiles
    let choosen_profile = []
    localUserInfo["profile_user"].forEach(profile_elem => {
      if(profile_elem["direction_id"] == elem["direction_id"]) {
        choosen_profile.push(profile_elem["priority"])
      }
    })

    localUserInfo["profile_user"].forEach(profile_elem => {
      if(profile_elem["direction_id"] == elem["direction_id"]) {
        const profile_item = document.createElement("div");
        const profile_id = parseInt(profile_elem["profile_id"], 10)
        profile_item.classList.add("profile_inner");

        let arrows_p
        if (profile_elem["priority"] == 0) {
          arrows_p = `<div class="column">
          <button class="down" onclick="move_profile(${profile_elem["direction_id"]}, ${profile_elem["priority"]}, 'down')">↓</button></div>`
        }
        else if (profile_elem["priority"] == choosen_profile[choosen_profile.length - 1]) {
          arrows_p = `<div class="column">
          <button class="up" onclick="move_profile(${profile_elem["direction_id"]}, ${profile_elem["priority"]}, 'up')">↑</button></div>`
        }
        else if (choosen_profile[choosen_profile.length - 1] > 1){
          arrows_p = `<div class="column">
          <button class="up" onclick="move_profile(${profile_elem["direction_id"]}, ${profile_elem["priority"]}, 'up')">↑</button>
          <button class="down" onclick="move_profile(${profile_elem["direction_id"]}, ${profile_elem["priority"]}, 'down')">↓</button></div>`
        }
        else {
          arrows_p = ''
        }

        profile_item.innerHTML = `
        ${arrows_p}
        <p>${profiles[profile_id]["name"]}</p>
        `;

        item.appendChild(profile_item)
      }
    })
  })
}

function saveUserInfo() {
  const value = entry.value
  if (!value) {
    alert("Введите имя пользователя")
    return
  }
  localUserInfo.username = value


  createPost(localUserInfo)
  console.log(localUserInfo)
}

async function getUserInfo() {
  const value = entry.value
  if (!value) {
    alert("Введите имя пользователя")
    return
  }

  const userinfo = await get_user_info(value)
  if (Object.keys(userinfo).length === 0 && userinfo.constructor === Object)
    return

  localUserInfo = userinfo

  structure()
}

main()

