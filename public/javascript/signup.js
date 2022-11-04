var email=document.getElementById("email");
var emailErrorField=document.getElementById("emailError");

var signup=document.getElementById("signup");


// ---------------- email validation -------------------- //

email.addEventListener('change', checkEmail);

function checkEmail(e){
  const regExp=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  if (!regExp.test(e.target.value)){
    emailErrorField.innerHTML="*Enter a valid email address"
    emailErrorField.classList.remove("d-none");
  }
  else{
    emailErrorField.innerHTML="*Email ID already registered, try <a href='/login' class='link-primary'>login</a>"

    fetch("/signup/"+e.target.value).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.text();
    }).then((text)=>{
                if(text==='true'){
                  emailErrorField.classList.remove("d-none");
                  signup.setAttribute("disabled","true");
                }
                else{
                  emailErrorField.classList.add("d-none");
                  signup.removeAttribute("disabled");
                }
      }).catch((error)=>console.log(error));
  }
}

// ---------------- password validation -------------------- //

var password = document.getElementById("password");
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var spcl=document.getElementById("spcl")
var number = document.getElementById("number");
var len = document.getElementById("length");

password.onfocus = function() {
  document.getElementById("message").classList.remove('d-none');
}


password.onkeyup = function() {
  // Validate lowercase letters
  var lowerCaseLetters = /[a-z]/g;
  if(password.value.match(lowerCaseLetters)) {  
    letter.classList.remove("invalid");
    letter.classList.add("valid");
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
  }
  
  // Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  if(password.value.match(upperCaseLetters)) {  
    capital.classList.remove("invalid");
    capital.classList.add("valid");
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }

  //validate soecial charachers
  var spclChars= /[-._!`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/g
  if(password.value.match(spclChars)) {  
    spcl.classList.remove("invalid");
    spcl.classList.add("valid");
  } else {
    spcl.classList.remove("valid");
    spcl.classList.add("invalid");
  }

  // Validate numbers
  var numbers = /[0-9]/g;
  if(password.value.match(numbers)) {  
    number.classList.remove("invalid");
    number.classList.add("valid");
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }
  
  // Validate length
  if(password.value.length >= 8) {
    len.classList.remove("invalid");
    len.classList.add("valid");
  } else {
    len.classList.remove("valid");
    len.classList.add("invalid");
  }
}

// ---------------- confirm password -------------------- //
var confPassword = document.getElementById("confPassword");
confPassword.onkeyup=function(){
  if(confPassword.value!==password.value){
    document.getElementById('confError').classList.remove('d-none');
  }else{
    document.getElementById('confError').classList.add('d-none');
  }
}
