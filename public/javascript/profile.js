var followBtn=document.getElementById('follow');
var requestedBtn=document.getElementById('requested');
var unfollowBtn=document.getElementById('unfollow');

followBtn.onclick=function(){
  fetch("/follow")
  .then((res) => res.text())
  .then((text)=>{
    if(text==='private'){
      followBtn.classList.add('d-none');
      requestedBtn.classList.remove('d-none');
    }else if(text==='public'){
      followBtn.classList.add('d-none');
      unfollowBtn.classList.remove('d-none');
      document.getElementById('followerCount').innerHTML=Number(document.getElementById('followerCount').innerHTML)+1;
    }
  });
}

requestedBtn.onclick=function(){
  fetch("/deleteReq")
  .then((res) => res.text())
  .then((text)=>{
    if(text==='deleted'){
      followBtn.classList.remove('d-none');
      requestedBtn.classList.add('d-none');
    }
  });
}

unfollowBtn.onclick=function(){
  fetch("/unfollow")
  .then((res) => res.text())
  .then((text)=>{
    followBtn.classList.remove('d-none');
    unfollowBtn.classList.add('d-none');
    document.getElementById('followerCount').innerHTML=Number(document.getElementById('followerCount').innerHTML)-1;
    if(text==='private'){
      document.getElementById('pvtAccMsg').classList.remove('d-none');
      document.getElementById('postsBox').classList.add('d-none');
    }
  });
}