document.querySelector("#female").addEventListener("click",show);
document.querySelector("#male").addEventListener("click",hide);
document.querySelector("#details").addEventListener("submit",calculate);

function show(event){
    document.querySelector("#hipVisibility").classList.remove("d-none");
    document.querySelector("#hip").removeAttribute('disabled')
}
function hide(event){
    document.querySelector("#hipVisibility").classList.add("d-none");
    document.querySelector("#hip").setAttribute('disabled','disabled');
}

function calculate(event){
    var gender=document.querySelector('input[name="gender"]:checked').value;
    var waist=parseFloat(document.querySelector("#waist").value);
    var neck=parseFloat(document.querySelector("#neck").value);
    var height=parseFloat(document.querySelector("#height").value);
    var weight=parseFloat(document.querySelector('#weight').value);
    var bfp;
    if(gender==="0"){
        bfp=(495/(1.0324-(0.19077*Math.log10(waist-neck))+(0.15456*Math.log10(height))))-450;
    }
    else{
        var hip=parseFloat(document.querySelector("#hip").value);
        bfp=(495/(1.29579-(0.35004*Math.log10(waist+hip-neck))+(0.22100*Math.log10(height))))-450; 
    }
    if(bfp<1) alert("Enter valid values.")
    else{
        document.querySelector("#loginButton").classList.add('d-none');
        document.querySelector("#bfp").innerHTML=(bfp.toFixed(2)+"%");
        document.querySelector('#bfpBox').classList.remove('d-none');

        const formData = new FormData();
        formData.append('height',height);
        formData.append('weight',weight);
        formData.append('bodyfat',bfp.toFixed(2));
        formData.append('waist',(waist*0.393701).toFixed(2));
        if(gender==='1'){
          formData.append('hip',(hip*0.393701).toFixed(2));
        }else{
          formData.append('hip','');
        }
        fetch('/tools/bodyFat_calculator',{
          method:"PUT",
          body:formData
        });

        event.preventDefault();
    }
}