// document.addEventListener('DOMContentLoaded',function(e){
//   let field = document.querySelector('.field');
//   let input = document.querySelector('input');
//   let copyBtn = document.querySelector('.field button');

//   copyBtn.onclick = () =>{
//       input.select();
//       if(document.execCommand("copy")){
//           field.classList.add('active');
//           copyBtn.innerText = 'Copied';
//           setTimeout(()=>{
//               field.classList.remove('active');
//               copyBtn.innerText = 'Copy';
//           },3500)
//       }
//   }
// })
getLocation();
askTermAndCondition();

function logincheck() {
    let email = localStorage.getItem("email");
    if (email) {
        return true;
    } else {
        return false;
    }
}

const getHeaders = () => {
    return {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("jwt"),
    };
};

const HOST_API_URL = "http://localhost:8000";
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

var global_post = null;
var lmt = 3;

async function fetch_data() {
    if (global_post == null) {
        let res = await fetch(`${POST_API_URL}/limit/${lmt}`, {
            method: "GET",
        });
        let posts = await res.json();
        global_post = posts?.content;
    }
}

window.addEventListener("scroll", () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (
        $(window).scrollTop() + $(window).height() >
        $(document).height() - 10
    ) {
        console.log("I am at bottom");
        lmt = lmt + 3;
        global_post = null;
        fetch_posts();
    }
});

async function fetch_posts() {
    await fetch_data();
    let bookmarks_arr = localStorage.getItem("bookmarks");
    let bookmarks = bookmarks_arr ? bookmarks_arr : [];
    let html_content = global_post
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
             <p class="card-text  lh-sm ctext">${post?.body.slice(0, 150)}</p>
          </a>
         <span class="d-flex  ">
           <p class="text-light www ">${post?.likes?.length + post?.ml} likes</p>
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
                   <a class="list-item-link" onclick="copy_link('${post?._id}')">
                     <span class="fas fa-link fsi "></span>
                   </a>
                 </li>
                 <li class="list-item">
                   <a class="list-item-link" onclick="share_post('${
                       post?._id
                   }', '${post?.title}', '${post?.hashtags}', 'whatsApp')">
                     <span class="fab fa-whatsapp fsi"></span>
                   </a>
                 </li>
                 <li class="list-item">
                   <a class="list-item-link" onclick="share_post('${
                       post?._id
                   }', '${post?.title}', '${post?.hashtags}', 'facebook')">
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
    <div class="hr mt-4"></div>
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
  <div class="col d-flex justify-content-center">
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
<span class="d-flex px-4 ">
           <p class="text-light www ">${poll?.likes?.length + poll?.ml} likes</p>
           <p class="www">${poll?.views + poll?.mv} views</p>
          </span>
           <div class="btns bg-black px-4">
           <div class="left d-flex align-items-center ">${like_content} <div id="box${
                    poll?._id
                }" onclick="share_toogle('${poll?._id}')" class="box">

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
                   <a class="list-item-link" onclick="share_post('${
                       poll?._id
                   }', '${poll?.title}', '${poll?.hashtags}', 'whatsApp')">
                     <span class="fab fa-whatsapp fsi"></span>
                   </a>
                 </li>
                 <li class="list-item">
                   <a class="list-item-link" onclick="share_post('${
                       poll?._id
                   }', '${poll?.title}', '${poll?.hashtags}', 'facebook')">
                     <span class="fab fa-facebook-f fsi"></span>
                   </a>
                 </li>
                 <li class="list-item">
                   <a class="list-item-link" onclick="share_post('${
                       poll?._id
                   }', '${poll?.title}', '${poll?.hashtags}', 'twitter')">
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
<div class="hr mt-4 "></div>
    `;
            }

            if (post?.mode === "billboard" && post?.size === "small") {
                return `
      <div class="col d-flex justify-content-center">
      <div class="card  billy-1   ">
        <img src="${post?.pic}" class="card-img-top billyimg-1" alt="Fissure in Sandstone"/>
        <div class="card-body bb pt-0">
          <p class="bn fw-light lh-sm m-0 p-0"><a href="">${post?.title}</a></p>
          <img src="img/bb.png" height="18px" alt="MDB Logo" loading="lazy"/>
    </div>
    </div>
    </div>
    <div class="hr "></div>
      `;
            }
            if (post?.mode === "billboard" && post?.size === "big") {
                return `
      <div class="col d-flex justify-content-center">
    <div class="card  billy  ">
      <img src="${post?.pic}" class="card-img-top billyimg" alt="Fissure in Sandstone"/>
      <div class="card-body bb ">
      <p class="bn fw-light lh-sm mb-1 p-0"><a href="">${post?.title}</a></p>
      <img src="img/bb.png" height="25px" alt="MDB Logo" loading="lazy" />
  </div>
  </div>
  </div>
  <div class="hr"></div>
      `;
            }

            if (post?.mode === "gossip") {
                return `
        
    
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
           <p class="text-light www ">${post?.likes?.length + post?.ml} likes</p>
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
                   <a class="list-item-link" onclick="copy_link('${post?._id}')">
                     <span class="fas fa-link fsi "></span>
                   </a>
                 </li>
                 <li class="list-item">
                   <a class="list-item-link" onclick="share_post('${
                       post?._id
                   }', '${post?.title}', '${post?.hashtags}', 'whatsApp')">
                     <span class="fab fa-whatsapp fsi"></span>
                   </a>
                 </li>
                 <li class="list-item">
                   <a class="list-item-link" onclick="share_post('${
                       post?._id
                   }', '${post?.title}', '${post?.hashtags}', 'facebook')">
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
    <div class="hr mt-2"></div>
        `;
            }
        })
        .join("");

    document.getElementById("articles").innerHTML = html_content;

    // document.getElementById("btn1").addEventListener("click", function () {
    //   document.getElementById("box").classList.toggle("act");
    // });
    // var elms = document.querySelectorAll("[id='btn1']");
    // var box = document.querySelectorAll("[id='box']");
    //   for(var i = 0; i < elms.length; i++)
    //     elms[i].addEventListener("click", function () {
    //       for(var i = 0; i < box.length; i++)
    //       {
    //         box[i].classList.toggle("act");
    //       }
    //     })
}
fetch_posts();

// function share_toogle(suffix) {
//   let id1 = 'btn1'+suffix;
//   let id2 = 'box'+suffix;
//   document.getElementById(id1).addEventListener("click", function () {
//       document.getElementById(id2).classList.toggle("act");
//     });

// }
function share_toogle(suffix) {
    let id2 = `box${suffix}`;
    document.getElementById(id2).classList.toggle("act");
}

function copy_link(id) {
    var base_url = window.location.origin;
    let postUrl = `${base_url}/shared_item.html?id=${id}`;
    navigator.clipboard.writeText(postUrl).then(
        function () {
            console.log("Async: Copying to clipboard was successful!");
        },
        function (err) {
            console.error("Async: Could not copy text: ", err);
        },
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
    let post = posts?.content;
    update_post(post);
    fetch_posts();
}

function update_post(post) {
    let new_arr = [];
    for (let i = 0; i < global_post.length; i++) {
        let old_post = global_post[i];
        if (old_post._id === post._id) {
            new_arr.push(post);
        } else {
            new_arr.push(old_post);
        }
    }
    global_post = new_arr;
}
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
    let post = posts?.content;
    update_post(post);
    fetch_posts();
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
    let post = posts?.content;
    update_post(post);
    localStorage.setItem("bookmarks", posts.content.bookmarks);
    fetch_posts();
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
    let post = posts?.content;
    update_post(post);
    fetch_posts();
}

async function fetch_trending_post() {
    let res = await fetch(`${POST_API_URL}/type/Trending`, { method: "GET" });
    let posts = await res.json();
    let i = 0;
    let html_content = posts?.content
        .map((post) => {
            i++;
            return `
  <a href="Articles.html?id=${post?._id}" class="text-light">
  <div class="card bg-transparent text-white crd ">
  <img src="${post?.pic}" class="card-img ci " alt="${post?.caption}"/>
  <h5 class="card-title cti">#${i}</h5>
  <div class="card-img-overlay cio d-flex align-items-end justify-content-center">
    <p class="card-text lh-sm para text-uppercase d-flex justify-content-center "> 
        ${post?.title}
   </p>
  </div>
</div>
</a>
    `;
        })
        .join("");

    document.getElementById("trending").innerHTML = html_content;
}
fetch_trending_post();
function prepareTags(tagString) {
    let tags = tagString.split(" ");
    return tags;
}

function ArrToStr(tags) {
    let tagStr = "";
    tags.forEach((tag) => {
        tagStr = `${tagStr}${tag} `;
    });
    return tagStr;
}

async function fetch_nearby_post() {
    let nearby_post = [];
    let res = await fetch(`${POST_API_URL}/onlypost`, { method: "GET" });
    let posts_res = await res.json();
    let posts = posts_res.content;
    let other_post = [];
    let location_str = localStorage.getItem("location");
    if (location_str) {
        let location_arr = prepareTags(location_str);
        for (let i = 0; i < posts.length; i++) {
            let post = posts[i];
            let flag = 1;
            for (let j = 0; j < location_arr.length; j++) {
                let str1 = location_arr[j].toLowerCase();
                let str2 = post?.location.toLowerCase();
                if (str1.includes(str2)) {
                    nearby_post.push(post);
                    flag = 0;
                    break;
                }
            }
            if (flag) {
                other_post.push(post);
            }
        }
        nearby_post.push(...other_post);
    } else {
        nearby_post.push(...posts);
    }

    let html_content_text = `
  <div class="cont text-wrap">
        <h2>Nearby</h2>
        <h3>
        (Explore the latest news around you)</h3>
    </div>
  `;
    let html_content = nearby_post
        .map(
            (post) =>
                `
  <a href="Articles.html?id=${post?._id}" class="text-light">
  <div class="card child bg-transparent ">
  <img src="${post?.near}" class="card-img-top cit rounded-9 border-3 " alt="${post?.caption}"/>
  <p class="card-text lh-sm para1 ">${post?.title}</p>
</div>
</a>
    `,
        )
        .join("");
    html_content_text = html_content_text + html_content;
    document.getElementById("nearby").innerHTML = html_content_text;
}

fetch_nearby_post();
function getLocation() {
    let location_str = localStorage.getItem("location");
    if (location_str === null) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                successfulLookup,
                console.log,
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }
}

function successfulLookup(position) {
    const { latitude, longitude } = position.coords;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=dce9404db6624c18a851862c2453d008`;
    fetch(url)
        .then((response) => response.json())
        .then((res) => {
            let location_obj = res.results?.[0].components;
            let l = [];
            l.push(location_obj.state_district);
            l.push(location_obj.county);
            l.push(location_obj.state);
            l.push(location_obj.suburb);
            l.push(res.results?.[0].formatted);
            localStorage.setItem("location", l);
            location.reload();
        })
        .catch((err) => {
            console.log(err);
        });
}

async function vote(opn, ans, pollId) {
    if (!logincheck()) {
        $("#exampleModal").modal("show");
        return;
    }
    let poll_payload = {
        opt: opn,
        ans: ans,
    };
    let res = await fetch(`${POLL_API_URL}/vote/${pollId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(poll_payload),
    });
    let poll = await res.json();
    let post = poll?.content;
    let userId = localStorage.getItem("_id");
    if (post?.vote.includes(userId)) {
        return;
    }
    update_post(post);
    fetch_posts();
}

function askTermAndCondition() {
    if (!localStorage.getItem("termAndCondition")) {
        document.getElementById("tnc").classList.remove("hidden");
    }
}

function acceptTermAndCondition() {
    localStorage.setItem("termAndCondition", true);
    document.getElementById("tnc").classList.add("hidden");
}
