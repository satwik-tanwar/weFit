// ---------------- mobile validation -------------------- //

var mobile=document.getElementById("mobile")
var mobilerrorField=document.getElementById("mobileError");
mobile.addEventListener('change', checkMobile);

function checkMobile(m){
  const regexExp = /^[6-9]\d{9}$/gi;

  if(m.target.value.length!=10){
    mobilerrorField.innerText="*Mobile number should be of 10 digits";
    mobilerrorField.classList.remove("d-none");
  }
  else if(!regexExp.test(m.target.value)){
    mobilerrorField.innerText="*Enter a valid mobile number";
    mobilerrorField.classList.remove("d-none");
  }
  else{
    mobilerrorField.classList.add("d-none");
  }
}


// ---------------- description textarea -------------------- //

const descr=document.getElementById("description");

descr.setAttribute("style", "height:" + (descr.scrollHeight) + "px;");
descr.addEventListener("input", OnInput, false);


function OnInput() {
  var len=this.value.length;
  document.getElementById("count").innerText=len+"/200"
  this.style.height='auto';
  this.style.height = (this.scrollHeight) + "px";
}

// ---------------- dp upload -------------------- //
const dp=document.getElementById("dp");
dp.style.opacity=0;

dp.addEventListener('change', updateImageDisplay);

function updateImageDisplay(){
  imgURL=URL.createObjectURL(dp.files[0]);
  document.getElementById("uploadedImg").src=imgURL;
  document.getElementById("uploadImgTxt").innerHTML="";
}

dp.addEventListener('change',sendImage);

function sendImage(){
  const formData = new FormData();
  formData.append('img', dp.files[0]);

  fetch('/home/completeProfile',{
    method:'PUT',
    body: formData
  });
}




