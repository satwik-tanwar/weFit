document.querySelector("#macros").addEventListener("change",custom);
document.querySelector("#details").addEventListener("submit",calculate);

function custom(event){
    var value=document.querySelector("#macros").value;
    if(value==='6'){
        document.querySelector("#macroC").classList.remove("d-none");
        document.querySelector("#carbs").removeAttribute('disabled');

        document.querySelector("#macroP").classList.remove("d-none");
        document.querySelector("#protiens").removeAttribute('disabled','disabled');

        document.querySelector("#macroF").classList.remove("d-none");
        document.querySelector("#fats").removeAttribute('disabled','disabled');
    }
    else{
        document.querySelector("#macroC").classList.add("d-none");
        document.querySelector("#carbs").setAttribute('disabled','disabled');

        document.querySelector("#macroP").classList.add("d-none");
        document.querySelector("#protiens").setAttribute('disabled','disabled');

        document.querySelector("#macroF").classList.add("d-none");
        document.querySelector("#fats").setAttribute('disabled','disabled');
    }
}

function calculate(event){
    var currWt=parseFloat(document.querySelector("#currentBW").value);
    var targetWt=parseFloat(document.querySelector("#targetBW").value);
    var weeks=parseInt(document.querySelector("#weeks").value);
    var tdee=parseFloat(document.querySelector("#tdee").value);
    var difference;

    difference=((targetWt-currWt)/weeks)*(550/0.5);
    difference=Math.round(difference);
    if(Math.abs(difference)>1000){ 
        alert("Your goal is too aggressive, try increasing the number of weeks to make your goal sustainable.");
    }
    else{
        var targetCal=tdee+difference;
        targetCal=Math.round(targetCal);

        var calOut=document.querySelector("#targetCal");
        var differenceElement=document.getElementById('difference');

        document.getElementById('calBox').classList.remove('d-none');
        document.getElementById('differenceHeading').classList.remove("d-none");
        document.getElementById('loginButton').classList.add('d-none');

        if(difference<0){
            document.getElementById('differenceHeading').innerHTML="Deficit"
        }
        else{
            document.getElementById('differenceHeading').innerHTML="Surplus"
        }

        differenceElement.innerHTML=Math.abs(difference)+" kcal/day";
        calOut.innerHTML=targetCal+' kcal/day';

        var value=parseInt(document.querySelector("#macros").value);
        var carbsRatio,protiensRatio,fatsRatio;
        var carbs,protiens,fats;
            
            switch(value){
                case 1:
                    carbsRatio=60;
                    protiensRatio=25;
                    fatsRatio=15;
                    break;
                case 2:
                    carbsRatio=50;
                    protiensRatio=30;
                    fatsRatio=20;
                    break;
                case 3:
                    carbsRatio=40;
                    protiensRatio=30;
                    fatsRatio=30;
                    break;
                case 4:
                    carbsRatio=25;
                    protiensRatio=35;
                    fatsRatio=40;
                    break;
                case 5:
                    carbsRatio=5;
                    protiensRatio=35;
                    fatsRatio=60;
                    break;
                case 6:
                    carbsRatio=parseInt(document.querySelector("#carbs").value);
                    protiensRatio=parseInt(document.querySelector("#protiens").value);
                    fatsRatio=parseInt(document.querySelector("#fats").value);
                    break;
            }
            carbs=((carbsRatio/100)*targetCal)/4;
            protiens=((protiensRatio/100)*targetCal)/4;
            fats=((fatsRatio/100)*targetCal)/9;

            document.getElementById('protienVal').innerHTML=protiens.toFixed(2)+' g/day';
            document.getElementById('carbsVal').innerHTML=carbs.toFixed(2)+' g/day';
            document.getElementById('fatsVal').innerHTML=fats.toFixed(2)+' g/day';


        const formData = new FormData();
        formData.append('goalCals',targetCal.toFixed(2));
        formData.append('protien',protiens.toFixed(2));
        formData.append('carbs',carbs.toFixed(2));
        formData.append('fats',fats.toFixed(2));
        fetch('/tools/goal_calculator',{
          method:"PUT",
          body:formData
        });
        event.preventDefault();
    }

    event.preventDefault();
}