const HOST_API_URL = "https://voice24.org";
const POST_API_URL = `${HOST_API_URL}/api/post`;
const GOSSIP_API_URL = `${HOST_API_URL}/api/gossip`;
const POLL_API_URL = `${HOST_API_URL}/api/poll`;
const LATEST_POLL_API_URL = `${POLL_API_URL}/latest`;
const SM_BD_API_URL = `${HOST_API_URL}/api/billboard/size/small`;
const BG_BD_API_URL = `${HOST_API_URL}/api/billboard/size/big`;
const UPLOAD_API_URL = `${HOST_API_URL}/upload`;
const STATIC_API_URL = `${HOST_API_URL}/public`;
const AUTHOR_API_URL = `${HOST_API_URL}/api/author`;
const ADMIN_API_URL = `${HOST_API_URL}/api/admin`;
const getHeaders = () => {
  return {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("jwt"),
  };
};

function logincheck() {
  let email = localStorage.getItem("email");
  if (email) {
    return true;
  } else {
    return false;
  }
}

async function like(postId) {
  if (!logincheck()) {
    $("#exampleModal").modal("show");
    return;
  }
  let id_payload = {
    _id: postId,
  };
  let res = await fetch(`${POST_API_URL}/like`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(id_payload),
  });
  let posts = await res.json();
  fetch_post(postId);
  fetch_suggestion(postId);
}

async function view(postId) {
  let id_payload = {
    _id: postId,
  };
  let res = await fetch(`${POST_API_URL}/view`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(id_payload),
  });
  let posts = await res.json();
  fetch_post(postId);
}

function get_body_Arr(body) {
  let arr = [];
  let cnt = 0;
  let cur = "";
  for (let i = 0; i < body.length; i++) {
    let ch = body[i];
    if (ch === " ") {
      cnt++;
    }
    cur = cur + body[i];

    if (cnt === 20) {
      arr.push(cur);
      cur = "";
      cnt = 0;
    }
  }
  arr.push(cur);
  return arr;
}

async function fetch_post(postId) {
  let res = await fetch(`${POST_API_URL}/${postId}`, { method: "GET" });
  let posts = await res.json();
  let post = posts.content;
  let body_arr = get_body_Arr(post?.body);
  let bookmarks_arr = localStorage.getItem("bookmarks");
  let bookmarks = bookmarks_arr ? bookmarks_arr : [];
  let author_id = localStorage.getItem("_id");
  let like_content = post?.likes.includes(author_id)
    ? `<i class="fa-regular fa-heart fs-1 fw-bold" onclick="unlike('${post?._id}')"></i> `
    : `<i class="fa-regular fa-heart fs-1" onclick="like('${post?._id}')"></i>`;
  let bookmark_content = bookmarks.includes(post?._id)
    ? `<i class="fa-regular fa-bookmark fs-1 fw-bold" onclick="unbookmark('${post?._id}')"></i> `
    : `<i class="fa-regular fs-1 fa-bookmark text-light" onclick="bookmark('${post?._id}')"></i>`;
  let temp = `
        <div class="card bg-dark text-white card-article">
      <img
        src="${post?.photo[0]}"
        class="card-img cardimg"
        alt="${post?.caption}"
      />
      <div class="article-date">
        <span class="vws ">${post?.updatedAt.slice(0, 10)}</span>
      </div>
      <div class="card-img-overlay d-flex align-items-end justify-content-start">
      </div>
    </div>
    
    `;
  let temp3 = `
    <iframe class="ytvid"src="${post?.bussinessLink}">
    </iframe>
    `;
  if (post?.bussinessLink) {
    temp = temp + temp3;
  }
  let temp4 = `
 
    <div class="article-lg">
    <div class="card bg-dark text-white card-article card-article-lg">
      <img
      src="${post?.photo[1]}"
      class="card-img cardimg"
      alt="${post?.caption}"
    />
    
      <div class="card-img-overlay d-flex align-items-end justify-content-start cover" >
        <div class="card-body cbody">
        <h5 class="card-title lh-sm A-card-title">
            ${post?.title}
          </h5>
        
          <p class="card-text lh-sm">
            ${body_arr[0]}
            
          </p>
        </div>
      </div>
    </div>

    <div class="lg-body ">
    <div class="marg">
    <span class="lg-heading fw-bold fs-3 lh-sm">
    ${post?.title}
    </span>
    <p class="lg-para mt-2">
            ${body_arr[0]}
            
          </p>
    </div>
    </div>
    </div>
        
    `;
  temp = temp + temp4;
  let temp2 = "";
  let temp1 = "";
  let imgd = 2;
  let ln = post?.photo.length;
  for (let i = 1; i < body_arr.length; i += 1) {
    if (ln === imgd) {
      break;
    }
    temp1 = `
    <div class="article-lg">
    <div class="card bg-dark text-white card-article card-article-lg">
      <img
      src="${post?.photo[imgd]}"
      class="card-img cardimg"
      alt="${post?.caption}"
    />
    
      <div class="card-img-overlay d-flex align-items-end justify-content-start cover" >
        <div class="card-body cbody">
        
          <p class="card-text lh-sm">
            ${body_arr[i]}
            
          </p>
        </div>
      </div>
    </div>

    <div class="lg-body ">
    <div class="marg">
    <p class="lg-para mt-2">
            ${body_arr[i]}
            
          </p>
    </div>
    </div>
    </div>
        `;
    temp2 += temp1;
    imgd = imgd + 1;
  }
  temp += temp2;

  // like-views-bookmark section
  let _temp = `
      <div class="d-flex align-items-center flex justify-content-center mt-4" id="like-views-bookmark" >
          ${like_content}                         
          
          <p class="www">${post?.likes?.length + post?.ml} likes</p>

          <i class="fa-regular fa-eye fs-1"></i>  
          <p class="www">${post?.views + post?.mv} views</p> 
          
          ${bookmark_content}
      </div> 
    `;
  temp += _temp;

  document.getElementById("article").innerHTML = temp;
}

async function fetch_suggestion(postId) {
  let res1 = await fetch(`${POST_API_URL}/${postId}`, { method: "GET" });
  let posts1 = await res1.json();
  let post1 = posts1.content;
  let category = post1.category;
  let res = await fetch(`${POST_API_URL}/category/${category}`, {
    method: "GET",
  });
  let posts_res = await res.json();
  let posts = posts_res?.content;
  let bookmarks_arr = localStorage.getItem("bookmarks");
  let bookmarks = bookmarks_arr ? bookmarks_arr : [];
  let org_posts = [];
  for (let i = 0; i < posts.length; i++) {
    if (posts[i]?._id !== postId) {
      org_posts.push(posts[i]);
    }
  }

  let html_content = org_posts
    .map((post) => {
      let author_id = localStorage.getItem("_id");
      let like_content = post?.likes.includes(author_id)
        ? `<i class="fa-regular fa-heart me-3 fw-bold" onclick="unlike('${post?._id}')"></i> `
        : `<i class="fa-regular fa-heart me-3" onclick="like('${post?._id}')"></i>`;
      let bookmark_content = bookmarks.includes(post?._id)
        ? `<i class="fa-regular fa-bookmark fw-bold" onclick="unbookmark('${post?._id}')"></i> `
        : `<i class="fa-regular fa-bookmark text-light" onclick="bookmark('${post?._id}')"></i>`;

      if (post?.mode === "post") {
        return `
            <div class="col d-flex justify-content-center">
            <a href="Articles.html?id=${post?._id}" class="text-light">
            <div class="card bg-black posts">
              <span class="d-flex justify-content-start text-uppercase"> <h6>${
                post?.category
              }</h6></span>
              <img src="${post?.cover}" class="card-img-top cito" alt="${
          post?.caption
        }"/>
              <div class="card-body cb bg-black">
                <h5 class="card-title lh-sm ctitle">${post?.title}</h5></a>
                <a href="Articles.html?id=${post?._id}" class="text-light">
                   <p class="card-text  lh-sm ctext">${post?.body.slice(
                     0,
                     150
                   )}</p>
                </a>
               <span class="d-flex  ">
                 <p class="text-light www ">${
                   post?.likes?.length + post?.ml
                 } likes</p>
                 <p class="www">${post?.views + post?.mv} views</p>
                </span>
                 <div class="btns bg-black ">
                 <div class="left d-flex align-items-center ">${like_content} <div id="box${
          post?._id
        }" onclick="share_toogle('${post?._id}')" class="box">
      
                   <button id="btn1${post?._id}" class="btn1">
                     <i class="fa-regular fa-paper-plane"></i>
                   </button>
                 
                   <ul id="list">
                       <li class="list-item ">
                         <a class="list-item-link" onclick="copy_link('${
                           post?._id
                         }')">
                           <span class="fas fa-link fsi "></span>
                         </a>
                       </li>
                       <li class="list-item">
                         <a class="list-item-link" onclick="share_post('${
                           post?._id
                         }', '${post?.title}', '${
          post?.hashtags
        }', 'whatsApp')">
                           <span class="fab fa-whatsapp fsi"></span>
                         </a>
                       </li>
                       <li class="list-item">
                         <a class="list-item-link" onclick="share_post('${
                           post?._id
                         }', '${post?.title}', '${
          post?.hashtags
        }', 'facebook')">
                           <span class="fab fa-facebook-f fsi"></span>
                         </a>
                       </li>
                       <li class="list-item">
                         <a class="list-item-link" onclick="share_post('${
                           post?._id
                         }', '${post?.title}', '${post?.hashtags}', 'twitter')">
                           <span class="fab fa-twitter fsi"></span>
                         </a>
                       </li>
                     </ul>
                     </div>
                   </div>
                 <div class="right">${bookmark_content}</div>
             </div>
          </div>
          </div>
          </div>  
          <div class="hr mt-4 "></div>
              `;
      }

      if (post?.mode === "poll") {
        let poll = post;
        let ans1 = poll?.ans1 + 1;
        let ans2 = poll?.ans2 + 1;
        let ans3 = poll?.ans3 + 1;
        let ans4 = poll?.ans4 + 1;
        let total = ans1 + ans2 + ans3 + ans4;
        let pr1 = Math.round((ans1 / total) * 100);
        let pr2 = Math.round((ans2 / total) * 100);
        let pr3 = Math.round((ans3 / total) * 100);
        let pr4 = Math.round((ans4 / total) * 100);
        return `
        <div class="col">
        <div class="mar">
        <div class="d-flex justify-content-between align-items-center polls ">
          <div class="polls1">POLLS</div>
          <img src="img/logo1.png" height="25px">
        </div>
        <div class="text-wrap mb-4">
          <h4>${poll.qsn}</h4>
         </div>
      <div class="ctnr d-flex justify-content-evenly">
        <div class="per " onclick="vote('1', '${poll?.ans1}', '${poll?._id}')">
        <div class="loadbar ">
        <div class="bar " style='height:${pr1}%;'></div>
        <h5>${poll.op1}</h5>
      </div>
      <p class="text-center percent">${pr1}%</p>
      </div>
        <div class="per " onclick="vote('2', '${poll?.ans2}', '${poll?._id}')">
        <div class="loadbar ">
        <div class="bar " style='height:${pr2}%;'></div>
        <h5>${poll.op2}</h5>
      </div>
      <p class="text-center percent">${pr2}%</p>
      </div>
      <div class="per " onclick="vote('3', '${poll?.ans3}', '${poll?._id}')">
        <div class="loadbar ">
        <div class="bar " style='height:${pr3}%;'></div>
        <h5>${poll.op3}</h5>
      </div>
      <p class="text-center percent">${pr3}%</p>
      </div>
       <div class="per " onclick="vote('4', '${poll?.ans4}', '${poll?._id}')">
        <div class="loadbar ">
        <div class="bar " style='height:${pr4}%;'></div>
        <h5>${poll.op4}</h5>
      </div>
      <p class="text-center percent">${pr4}%</p>
      </div>
      </div>
      <span class="d-flex  ">
                 <p class="text-light www ">${poll?.likes?.length} likes</p>
                 <p class="www">${poll?.views} views</p>
                </span>
                 <div class="btns bg-black ">
                 <div class="left d-flex align-items-center ">${like_content} <div id="box${poll?._id}" onclick="share_toogle('${poll?._id}')" class="box">
      
                   <button id="btn1${poll?._id}" class="btn1">
                     <i class="fa-regular fa-paper-plane"></i>
                   </button>
                 
                   <ul id="list">
                       <li class="list-item ">
                         <a class="list-item-link" onclick="copy_link('${poll?._id}')">
                           <span class="fas fa-link fsi "></span>
                         </a>
                       </li>
                       <li class="list-item">
                         <a class="list-item-link" onclick="share_post('${poll?._id}', '${poll?.title}', '${poll?.hashtags}', 'whatsApp')">
                           <span class="fab fa-whatsapp fsi"></span>
                         </a>
                       </li>
                       <li class="list-item">
                         <a class="list-item-link" onclick="share_post('${poll?._id}', '${poll?.title}', '${poll?.hashtags}', 'facebook')">
                           <span class="fab fa-facebook-f fsi"></span>
                         </a>
                       </li>
                       <li class="list-item">
                         <a class="list-item-link" onclick="share_post('${poll?._id}', '${poll?.title}', '${poll?.hashtags}', 'twitter')">
                           <span class="fab fa-twitter fsi"></span>
                         </a>
                       </li>
                     </ul>
                     </div>
                   </div>
                 <div class="right">${bookmark_content}</div>
             </div>
      </div>
      </div>
      
          `;
      }

      if (post?.mode === "billboard" && post?.size === "small") {
        return `
            <div class="col d-flex justify-content-center">
            <div class="card  billy-1 mb-3  ">
              <img src="${post?.pic}" class="card-img-top billyimg-1" alt="Fissure in Sandstone"/>
              <div class="card-body bb ">
                <h5 class="card-title lh-sm bill-title mb-0">BILLBOARD</h5>
                <p class="bn fw-light lh-sm m-0"><a href="">${post?.title}</a></p>
          </div>
          
          </div>
          </div>
          <div class="hr mb-2"></div>
            `;
      }
      if (post?.mode === "billboard" && post?.size === "big") {
        return `
            <div class="col d-flex justify-content-center">
          <div class="card  billy mb-3  ">
            <img src="${post?.pic}" class="card-img-top billyimg" alt="Fissure in Sandstone"/>
            <div class="card-body bb ">
              <h5 class="card-title lh-sm bill-title mb-0">BILLBOARD</h5>
              <p class="bn fw-light lh-sm m-0"><a href="">${post?.title}</a></p>
        </div>
        </div>
        </div>
        <div class="hr mb-2"></div>
            `;
      }

      if (post?.mode === "gossip") {
        return `
              <div class="hr mb-2"></div>
          
            <div class="col d-flex justify-content-center">
          
              <div class="card posts bg-black  ">
                <span class="d-flex justify-content-between "> <div class="polls1 gossips" >GOSSIPS</div></span>
                <div class="card-body cb1 bg-black">
                 <div class="gossipsbody">
                 <div class="gossipsimg">
                 <img src="img/logo1.png"" height="20px" >
                 <span >@odishavoice24</span>
               </div>
                  <p class="card-text  lh-sm mb-4 ctext">${post?.body}</p>
                  <p class="web">www.odishavoice24.com</p>
                 </div>
                 <span class="d-flex  ">
                 <p class="text-light www ">${post?.likes?.length} likes</p>
                 <p class="www">${post?.views} views</p>
                </span>
                 <div class="btns bg-black ">
                 <div class="left d-flex align-items-center ">${like_content} <div id="box${post?._id}" onclick="share_toogle('${post?._id}')" class="box">
      
                   <button id="btn1${post?._id}" class="btn1">
                     <i class="fa-regular fa-paper-plane"></i>
                   </button>
                 
                   <ul id="list">
                       <li class="list-item ">
                         <a class="list-item-link" onclick="copy_link('${post?._id}')">
                           <span class="fas fa-link fsi "></span>
                         </a>
                       </li>
                       <li class="list-item">
                         <a class="list-item-link" onclick="share_post('${post?._id}', '${post?.title}', '${post?.hashtags}', 'whatsApp')">
                           <span class="fab fa-whatsapp fsi"></span>
                         </a>
                       </li>
                       <li class="list-item">
                         <a class="list-item-link" onclick="share_post('${post?._id}', '${post?.title}', '${post?.hashtags}', 'facebook')">
                           <span class="fab fa-facebook-f fsi"></span>
                         </a>
                       </li>
                       <li class="list-item">
                         <a class="list-item-link" onclick="share_post('${post?._id}', '${post?.title}', '${post?.hashtags}', 'twitter')">
                           <span class="fab fa-twitter fsi"></span>
                         </a>
                       </li>
                     </ul>
                     </div>
                   </div>
                 <div class="right">${bookmark_content}</div>
             </div>
           </div>
           </div>
          </div>
              `;
      }
    })
    .join("");

  document.getElementById("suggest").innerHTML = html_content;
}
function share_toogle(suffix) {
  let id2 = `box${suffix}`;
  document.getElementById(id2).classList.toggle("act");
}
function copy_link(id) {
  var base_url = window.location.origin;
  let postUrl = `${base_url}/shared_item.html?id=${id}`;
  navigator.clipboard.writeText(postUrl).then(
    function () {},
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

function share_post(id, title, hashtags, media) {
  let hashTag = hashtags;
  var base_url = window.location.origin;
  let postUrl = `${base_url}/shared_item.html?id=${id}`;
  if (media === "twitter") {
    url = `https://twitter.com/share?url=${postUrl}&text=${title}&hashtags=${hashTag}`;
  } else if (media === "facebook") {
    url = `https://www.facebook.com/sharer.php?u=${postUrl}`;
  } else if (media === "whatsApp") {
    url = `https://api.whatsapp.com/send?text=${title} ${postUrl}`;
  } else if (media === "linkedIn") {
    url = `https://www.linkedin.com/shareArticle?url=${postUrl}&title=${PostTitle}`;
  } else {
    url = `https://pinterest.com/pin/create/bookmarklet/?url=${postUrl}&description=${PostTitle}`;
  }
  window.open(url, "_blank");
}

$(function () {
  var postId = location.search.split("id=")[1];
  fetch_post(postId);
  view(postId);
  fetch_suggestion(postId);
});

async function unlike(postId) {
  if (!logincheck()) {
    $("#exampleModal").modal("show");
    return;
  }
  let id_payload = {
    _id: postId,
  };
  let res = await fetch(`${POST_API_URL}/unlike`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(id_payload),
  });
  let posts = await res.json();
  fetch_post(postId);
  fetch_suggestion(postId);
}

async function bookmark(postId) {
  if (!logincheck()) {
    $("#exampleModal").modal("show");
    return;
  }
  let id_payload = {
    _id: postId,
  };
  let res = await fetch(`${AUTHOR_API_URL}/bookmark`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(id_payload),
  });
  let posts = await res.json();
  localStorage.setItem("bookmarks", posts.content.bookmarks);
  fetch_suggestion(postId);
  fetch_post(postId);
}
async function unbookmark(postId) {
  if (!logincheck()) {
    $("#exampleModal").modal("show");
    return;
  }
  let id_payload = {
    _id: postId,
  };
  let res = await fetch(`${AUTHOR_API_URL}/unbookmark`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(id_payload),
  });
  let posts = await res.json();
  localStorage.setItem("bookmarks", posts.content.bookmarks);
  fetch_suggestion(postId);
  fetch_post(postId);
}
