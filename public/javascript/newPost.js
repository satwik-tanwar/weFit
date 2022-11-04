const post=document.getElementById("post");
const caption=document.getElementById("caption");

post.addEventListener('change', updateImageDisplay);

function updateImageDisplay(){
  imgURL=URL.createObjectURL(post.files[0]);
  document.getElementById("newPostImg").src=imgURL;
  document.getElementById("newPostBox").classList.remove('d-none');
  post.classList.add('d-none');
}

document.getElementById("submitBtn").onclick=function(){
  const formData = new FormData();
  formData.append('img', post.files[0]);
  formData.append('caption',caption.value);

  fetch('/newPost',{
    method:'POST',
    body: formData
  }).then((response) => response.text())
  .then((text)=>{
    window.location.replace("/post/"+text);
  });
}



caption.setAttribute("style", "height:" + (caption.scrollHeight) + "px;");
caption.addEventListener("input", OnInput, false);


function OnInput() {
  var len=this.value.length;
  if (len===0){
    document.getElementById("wordCount").innerText="";
  }else{
    document.getElementById("wordCount").innerText=len+"/200";
  }
  this.style.height='auto';
  this.style.height = (this.scrollHeight) + "px";
}

