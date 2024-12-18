const postContainer = document.getElementById("posts-container");
const loaderElem = document.querySelector("section.loader");
const filterInput = document.querySelector("#filter");
const content = document.getElementById("articleContent");

let page = 1;

async function getPosts() {
  const resp = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`
  );

  return resp.json();
}

const generatePostTemplate = (posts) => {
  return posts
    .map(
      ({ id, title, body }) => `
        <div class="post">
            <div class="number">${id}</div>
            <div class="post-info">
                <h2 class="post-title">${title}</h2>
                <p class="post-body">${body}</p>
            </div>
        </div>`
    )
    .join("");
};

async function addPostsIntoDom() {
  const posts = await getPosts();
  const postsTemplate = generatePostTemplate(posts);
  postContainer.innerHTML += postsTemplate;
}

function getNextPosts() {
  setTimeout(() => {
    page++;
    addPostsIntoDom();
  }, 300);
}

function removeLoader() {
  setTimeout(() => {
    loaderElem.classList.remove("show");
    getNextPosts();
  }, 1000); //ms
}

function showLoader() {
  loaderElem.classList.add("show");
  removeLoader();
}

// closure
const showPostIfMatchInputValue = (inputValue) => (post) => {
  const regex = new RegExp(`(${inputValue})`, "gi");

  const postElem = {
    titleText: post.querySelector("h2.post-title").textContent.toLowerCase(),
    bodyText: post.querySelector("p.post-body").textContent.toLowerCase(),
    title: post.querySelector("h2.post-title"),
    body: post.querySelector("p.post-body"),
  };

  if (postElem.titleText.includes(inputValue)) {
    post.style.display = "flex";
    const newTitleText = postElem.titleText.replace(regex, "<mark>$1</mark>");

    if (postElem.title.textContent !== newTitleText) {
      postElem.title.innerHTML = newTitleText;
    }

    return;
  }

  if (postElem.bodyText.includes(inputValue)) {
    post.style.display = "flex";
    const newBodyText = postElem.bodyText.replace(regex, "<mark>$1</mark>");

    if (postElem.body.textContent !== newBodyText) {
      postElem.body.innerHTML = newBodyText;
    }
    return;
  }
  post.style.display = "none";
};

function handlerScroll() {
  const { clientHeight, scrollHeight, scrollTop } = document.documentElement;
  const isAlmostPageBottom = scrollTop + clientHeight >= scrollHeight - 5;

  if (isAlmostPageBottom) {
    showLoader();
  }
}

function handlerInputValue(event) {
  const inputValue = event.target.value;
  const posts = document.querySelectorAll("div.post");
  posts.forEach(showPostIfMatchInputValue(inputValue));
}

addPostsIntoDom();

window.addEventListener("scroll", handlerScroll);
filterInput.addEventListener("input", handlerInputValue);

/*  
window.addEventListener("scrollend", showLoader);
*/
