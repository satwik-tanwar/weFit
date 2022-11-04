var like=document.getElementById('like');

if(Object.values(like.classList).indexOf('text-danger') > -1){
  var liked=true;
}else{
  var liked=false;
}

like.onclick=function(){
  var likeCount=document.getElementById("likeCount");
  if(liked){
    liked=false
    like.classList.add("fa-regular");
    like.classList.remove("fa-solid");
    like.classList.remove("text-danger");
    likeCount.innerHTML=Number(likeCount.innerHTML)-1;

    const formData = new FormData();
    formData.append('action','unlike');
    formData.append('postId',document.getElementById('postID').value)
    
    fetch('/liked',{
      method:'POST',
      body: formData
    })
  }else{
    liked=true;
    like.classList.remove("fa-regular");
    like.classList.add("fa-solid");
    like.classList.add("text-danger");
    likeCount.innerHTML=Number(likeCount.innerHTML)+1;

    const formData = new FormData();
    formData.append('action','like');
    formData.append('postId',document.getElementById('postID').value)
    
    fetch('/liked',{
      method:'POST',
      body: formData
    })
  }
}

var comment=document.getElementById('comment');
comment.setAttribute("style", "height:" + (comment.scrollHeight) + "px;");
comment.addEventListener("input", OnInput, false);


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

document.getElementById("commentBtn").onclick=function(){
    const formData = new FormData();
    formData.append('comment',comment.value);
    
    fetch('/comment',{
      method:'POST',
      body: formData
    })
    .then(function(res) {
      location.reload()
    })
    .catch(function(err) {
      location.reload()
    });
    
}