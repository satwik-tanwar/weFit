document.querySelector("#details").addEventListener("submit",display);
function display(event){
    var gender=document.querySelector('input[name="gender"]:checked').value;
    var weight=parseFloat(document.querySelector("#weight").value);
    var height=parseFloat(document.querySelector("#height").value);
    var age=parseFloat(document.querySelector("#age").value);
    var exercise=parseFloat(document.querySelector("#exercise").value);
    var bmr,tdee;
    if(gender==="0"){
        bmr=(10*weight)+(6.25*height)-(5*age)+5;
        tdee=bmr*exercise;
    }
    else{
        bmr=(10*weight)+(6.25*height)-(5*age)-161;
        tdee=bmr*exercise;
    }
    document.querySelector("#loginButton").classList.add('d-none');
    document.querySelector("#bmr").innerHTML=(bmr.toFixed(2)+' kcal/day');
    document.querySelector("#tdee").innerHTML=(tdee.toFixed(2)+' kcal/day');
    document.querySelector("#bmrBox").classList.remove('d-none');

    const formData = new FormData();
    formData.append('bmr',bmr);
    formData.append('tdee',tdee);
    fetch('/tools/bmr_calculator',{
      method:"PUT",
      body:formData
    });
    event.preventDefault();
}