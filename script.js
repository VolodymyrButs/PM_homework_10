const input = document.querySelector("input");
const userBlock = document.querySelector("#userBlock");
const noUser = document.querySelector("#noUser");
const repositories = document.querySelector("#repo");
const followers = document.querySelector("#followers");
const repositoriesButton = document.querySelector("#repoButton");
const followersButton = document.querySelector("#followersButton");
const loading = document.querySelector(".loading");

//---------------------------------

const github = axios.create({
  baseURL: "https://api.github.com/",
});

function debounce(cb, duration) {
  var timer;
  return function () {
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      cb.apply(null, args);
    }, duration);
  };
}

//--------------------------------- USER

const getUser = () => {
  loading.style.display = "flex";
  repositories.style.display = "none";
  followers.style.display = "none";
  if (input.value === "") {
    repositoriesButton.style.display = "none";
    followersButton.style.display = "none";
    loading.style.display = "none";
    userBlock.innerHTML = "";
  } else {
    github
      .get(`/users/${input.value}`)
      .then((response) => {
        userBlock.innerHTML = "";
        let userLink = document.createElement("a");
        let userButton = document.createElement("button");
        let user = document.createElement("p");
        userLink.setAttribute("target", "blank");
        userLink.setAttribute("style", "border-bottom:none;width:72px;");
        let img = document.createElement("img");
        img.setAttribute("style", "width:67px; height:67px;");
        img.setAttribute("src", response.data.avatar_url);
        userLink.appendChild(userButton);
        userLink.setAttribute("href", response.data.html_url);
        userButton.setAttribute("style", "padding:5px;");
        userButton.innerText = "GO TO USER PAGE";
        user.innerText = `Name: "${response.data.login}"`;
        user.setAttribute("id", "userName");
        userBlock.appendChild(img);
        userBlock.appendChild(user);
        userBlock.appendChild(userLink);
        repositoriesButton.style.display = "inline";
        repositoriesButton.innerText = "Show repositories";
        followersButton.style.display = "inline";
        followersButton.innerText = "Show followers";
        noUser.innerText = "";
        loading.style.display = "none";
      })
      .catch((err) => {
        console.log(err);
        noUser.innerText = "User with this name doesn't exist";
        userBlock.innerHTML = "";
        repositoriesButton.style.display = "none";
        followersButton.style.display = "none";
        loading.style.display = "none";
      });
  }
};

input.addEventListener("input", debounce(getUser, 1000));

//--------------------------------- REPO

const handleRepoClick = () => {
  loading.style.display = "flex";
  if (repositories.style.display === "flex") {
    repositories.style.display = "none";
    repositoriesButton.innerText = "Show repositories";
    loading.style.display = "none";
  } else {
    repositories.innerHTML = "";
    github
      .get(`/users/${input.value}/repos`)
      .then((response) => response.data)
      .then((data) => {
        repositories.style.display = "flex";
        let noItem = document.createElement("p");
        noItem.innerText = `No public repo in user ${input.value}`;
        data.length === 0 && repositories.appendChild(noItem);
        repositoriesButton.innerText = "Hide repositories";
        data.map((repo) => {
          let item = document.createElement("a");
          item.setAttribute("href", repo.html_url);
          item.setAttribute("target", "blank");
          item.innerText = repo.name;
          repositories.appendChild(item);
        });
        loading.style.display = "none";
      })
      .catch((err) => {
        console.log(err);
        loading.style.display = "none";
      });
  }
};

repositoriesButton.onclick = function () {
  handleRepoClick();
};

//--------------------------------- FOLLOWERS

const handleFolowClick = () => {
  loading.style.display = "flex";
  if (followers.style.display === "flex") {
    followers.style.display = "none";
    followersButton.innerText = "Show followers";
    loading.style.display = "none";
  } else {
    followers.innerHTML = "";
    github
      .get(`/users/${input.value}/followers`)
      .then((response) => response.data)
      .then((data) => {
        followers.style.display = "flex";
        let noItem = document.createElement("p");
        noItem.innerText = `No followers in user ${input.value}`;
        data.length === 0 && followers.appendChild(noItem);
        followersButton.innerText = "Hide followers";
        data.map((folower) => {
          let item = document.createElement("a");
          let img = document.createElement("img");
          img.style.width = "67px";
          console.log(img, folower.avatar_url);
          let wrapper = document.createElement("div");
          wrapper.style.display = "flex";
          img.setAttribute("src", folower.avatar_url);
          item.setAttribute("href", folower.html_url);
          item.setAttribute("target", "blank");
          item.style.alignSelf = "flex-end";
          item.innerText = folower.login;
          wrapper.appendChild(item);
          wrapper.appendChild(img);
          followers.appendChild(wrapper);
        });
        loading.style.display = "none";
      })
      .catch((err) => {
        console.log(err);
        loading.style.display = "none";
      });
  }
};

followersButton.onclick = function () {
  handleFolowClick();
};
