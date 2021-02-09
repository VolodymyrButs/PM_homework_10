const input = document.querySelector("input");
const user = document.querySelector("a");
const noUser = document.querySelector("#noUser");
const repositories = document.querySelector("#repo");
const followers = document.querySelector("#followers");
const repositoriesButton = document.querySelector("#repoButton");
const followersButton = document.querySelector("#followersButton");
const loading = document.querySelector(".loading");

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

const getUser = () => {
  loading.style.display = "flex";
  repositories.style.display = "none";
  followers.style.display = "none";
  if (input.value === "") {
    repositoriesButton.style.display = "none";
    followersButton.style.display = "none";
    user.innerText = "";
  } else {
    github
      .get(`/users/${input.value}`)
      .then((response) => {
        user.setAttribute("href", response.data.html_url);
        user.innerText = `Visit GitHub page of user "${response.data.login}"`;
        repositoriesButton.style.display = "inline";
        repositoriesButton.innerText = "Show repositories";
        followersButton.style.display = "inline";
        followersButton.innerText = "Show followers";
        noUser.innerText = "";
        loading.style.display = "none";
      })
      .catch((err) => {
        console.log(err);
        noUser.innerText = "User with this name not exist";
        user.innerText = "";
        repositoriesButton.style.display = "none";
        followersButton.style.display = "none";
        loading.style.display = "none";
      });
  }
};

input.addEventListener("input", debounce(getUser, 1000));

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
        data.length !== 0 && (repositories.style.display = "flex");
        data.length === 0 && alert(`No publick repo in user ${input.value}`);
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
        data.length !== 0 && (followers.style.display = "flex");
        data.length === 0 && alert(`No followers in user ${input.value}`);
        followersButton.innerText = "Hide followers";
        data.map((repo) => {
          let item = document.createElement("a");
          item.setAttribute("href", repo.html_url);
          item.setAttribute("target", "blank");
          item.innerText = repo.login;
          followers.appendChild(item);
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
followersButton.onclick = function () {
  handleFolowClick();
};
