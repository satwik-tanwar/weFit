// -------------------------- Style --------------------------- //

const sideBar=document.getElementById('sidebar');

function resize(){
  var availHeight=window.innerHeight-document.querySelector('footer').clientHeight-document.querySelector('nav').clientHeight+5;
  if((document.getElementById('addFood-body').clientHeight+64<availHeight) && (document.getElementById('food-body').clientHeight+64<availHeight) && (document.getElementById('diet-body').clientHeight+80<availHeight)){
    sideBar.style.height=Math.max(document.getElementById('menu').clientHeight,availHeight)+'px';
  }
  else{
    var cal=document.getElementById('calendar');
    var style = cal.currentStyle || window.getComputedStyle(cal);
    if(window.innerWidth>=768){
      var height;
      if(document.getElementById('addFood-body').clientHeight>0)
        height=document.getElementById('addFood-body').clientHeight
      else if(document.getElementById('food-body').clientHeight>0)
        height=document.getElementById('food-body').clientHeight
      else if(document.getElementById('diet-body').clientHeight>0)
        height=document.getElementById('diet-body').clientHeight+16

      sideBar.style.height=height+65+'px';

      document.getElementById('diet-summary').style.marginLeft=0;
    }
    else{  
      sideBar.style.height=document.getElementById('menu').clientHeight+1+'px';
      document.getElementById('diet-summary').style.marginLeft=style.marginLeft;
    }
  }
  
}
window.onload=resize;
window.onresize=resize;

const addFood=document.getElementById('addFood');
const food=document.getElementById('food');
const diet=document.getElementById('diet');

addFood.onclick=function(){
  addFood.classList.add('sidebar-active');
  food.classList.remove('sidebar-active');
  diet.classList.remove('sidebar-active');

  document.getElementById('addFood-body').classList.remove('d-none');
  document.getElementById('food-body').classList.add('d-none');
  document.getElementById('diet-body').classList.add('d-none');
  resize();
}

food.onclick=function(){
  addFood.classList.remove('sidebar-active');
  food.classList.add('sidebar-active');
  diet.classList.remove('sidebar-active');

  document.getElementById('addFood-body').classList.add('d-none');
  document.getElementById('food-body').classList.remove('d-none');
  document.getElementById('diet-body').classList.add('d-none');
  resize();
}

diet.onclick=function(){
  addFood.classList.remove('sidebar-active');
  food.classList.remove('sidebar-active');
  diet.classList.add('sidebar-active');

  document.getElementById('addFood-body').classList.add('d-none');
  document.getElementById('food-body').classList.add('d-none');
  document.getElementById('diet-body').classList.remove('d-none');
  resize();
}

// ---------------- calc calories --------------------- //

var protienInp=document.getElementById('protien');
var carbInp=document.getElementById('carb');
var fatInp=document.getElementById('fat');
var calInp=document.getElementById('cal');

var protien=0, carb=0, fat=0;

protienInp.oninput=function(){
  protien=Number(protienInp.value);
  calInp.value=(protien*4)+(carb*4)+(fat*9);
}
carbInp.oninput=function(){
  carb=Number(carbInp.value);
  calInp.value=(protien*4)+(carb*4)+(fat*9);
}
fatInp.oninput=function(){
  fat=Number(fatInp.value);
  calInp.value=(protien*4)+(carb*4)+(fat*9);
}

// ---------------- save new food --------------------- //

var foodName=document.getElementById('foodName');

foodName.onchange=function(){
  fetch('/tools/diet_tool/checkFood/'+foodName.value)
  .then((response)=>response.text())
  .then(function(text){
    if(text==='found'){
      document.getElementById('savedErr').classList.remove('d-none');
      resize();
    }else{
      document.getElementById('savedErr').classList.add('d-none');
    }
  });
}

// ----------------  Delete saved food --------------------- //

var deleteSavedFoodBtns=document.getElementsByClassName('deleteSavedFood');
for(var i=0;i<deleteSavedFoodBtns.length;i++){
  deleteSavedFoodBtns[i].onclick=function(){
    if(confirm("Are you sure you want to delete "+this.id+" from your saved food?")){
      fetch('/tools/diet_tool/deleteFood/'+this.id);
      document.getElementById(this.id+' row').classList.add("d-none");
    }
  }
}


// ----------------  Add food to today's diet --------------------- //
var addBreakfastBtn=document.getElementById('addBreakfast');
var addLunchBtn=document.getElementById('addLunch');
var addSnacksBtn=document.getElementById('addSnacks');
var addDinnerBtn=document.getElementById('addDinner');

var selectMealType=document.getElementById('selectMealType');
var addBtn=document.getElementById('addBtn');



addBreakfastBtn.onclick=function(){
  food.click();
  selectMealType.selectedIndex=1;
  updateAddBtns();
}
addLunchBtn.onclick=function(){
  food.click();
  selectMealType.selectedIndex=2;
  updateAddBtns();
}
addSnacksBtn.onclick=function(){
  food.click();
  selectMealType.selectedIndex=3;
  updateAddBtns();
};
addDinnerBtn.onclick=function(){
  food.click();
  selectMealType.selectedIndex=4;
  updateAddBtns();
};


var addBtns=document.getElementsByClassName('addBtn');
var mealTypeInps=document.getElementsByClassName('mealTypeInp');

function updateAddBtns(){
  if(selectMealType.value==='breakfast'){
    for(var i=0;i<addBtns.length;i++){
      addBtns[i].innerHTML='Add to Breakfast';
      addBtns[i].removeAttribute('disabled');
      mealTypeInps[i].value='breakfast';
    }
  } else if(selectMealType.value==='lunch'){
    for(var i=0;i<addBtns.length;i++){
      addBtns[i].innerHTML='Add to Lunch';
      addBtns[i].removeAttribute('disabled');
      mealTypeInps[i].value='lunch';
    }
  } else if(selectMealType.value==='snacks'){
    for(var i=0;i<addBtns.length;i++){
      addBtns[i].innerHTML='Add to Snacks';
      addBtns[i].removeAttribute('disabled');
      mealTypeInps[i].value='snacks';
    }
  } else if(selectMealType.value==='dinner'){
    for(var i=0;i<addBtns.length;i++){
      addBtns[i].innerHTML='Add to Dinner';
      addBtns[i].removeAttribute('disabled');
      mealTypeInps[i].value='dinner';
    }
  } 
}

selectMealType.onchange=updateAddBtns;

// ----------------  calendar --------------------- //

const date = new Date();
var selectedDate;

const renderCalendar = () => {
  date.setDate(1);
  const monthDays = document.querySelector(".calender-days");
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  const firstDayIndex = date.getDay();
  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  const nextDays = 7 - lastDayIndex - 1;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  document.querySelector(".calender-date h1").innerHTML = months[date.getMonth()]+', '+date.getFullYear();

  let days = "";
  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    if (i === new Date().getDate() && date.getMonth() === new Date().getMonth() && typeof selectedDate === 'undefined') { 
      days += `<div class="curr selected">${i}</div>`;
    } else {
      days += `<div class="curr">${i}</div>`;
    }
  }
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
  }
  monthDays.innerHTML = days;

  if(document.querySelector('.selected')===null){
    document.querySelector(".calender-date p").innerHTML=selectedDate;
  }else{
  selectedDate=new Date((date.getMonth()+1)+'/'+document.querySelector('.selected').innerHTML+'/'+date.getFullYear());
  selectedDate=selectedDate.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
  document.querySelector(".calender-date p").innerHTML=selectedDate;
  }
};

document.querySelector(".prev").addEventListener("click", () => {
  if(date.getMonth()-1<0){
    date.setFullYear(date.getFullYear()-1);
    date.setMonth(11);
  }else{
    date.setMonth(date.getMonth() - 1);
  }
  renderCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
  if(date.getMonth()+1>12){
    date.setFullYear(date.getFullYear()+1);
    date.setMonth(0);
  }else{
    date.setMonth(date.getMonth() + 1);
  }
  renderCalendar();
});

renderCalendar();
addEntryDots();
getData(document.querySelector('.selected'));

var daysOfMonth=document.querySelectorAll('.curr');
getDietData(daysOfMonth);

function getDietData(daysOfMonth){
  daysOfMonth.forEach(function(day){
    day.addEventListener('click',function(){
      getData(this);
    });
  });
}



document.querySelector(".prev").addEventListener("click", () => {
  addEntryDots();
  daysOfMonth=document.querySelectorAll('.curr');
  getDietData(daysOfMonth);
});

document.querySelector(".next").addEventListener("click", () => {
  addEntryDots();
  daysOfMonth=document.querySelectorAll('.curr');
  getDietData(daysOfMonth);
});


function addEntryDots(){
  const formData = new FormData();
  formData.append('date', date);

  fetch('/tools/diet_tool/dataPoints',{
    method:'POST',
    body:formData
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.blob();
  })
  .then((response) => {
    response.text().then(function (text) {
      text=text.substring(1,text.length-1);
      var dates=text.split(',');

      const currMonthDates=document.getElementsByClassName('curr');
      for(var i=0;i<currMonthDates.length;i++){
        day=currMonthDates[i];
        if (dates.includes(day.innerHTML)){
          day.classList.add('entryDot');
        }
      }
    });
  });
}



function getData(element){
  if(document.querySelector('.selected')!==null){
    document.querySelector('.selected').classList.remove('selected');
  }
  
  element.classList.add('selected');
  selectedDate=new Date((date.getMonth()+1)+'/'+document.querySelector('.selected').innerHTML+'/'+date.getFullYear());
  selectedDate=selectedDate.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
  document.querySelector(".calender-date p").innerHTML=selectedDate;

  
  const formData = new FormData();
  formData.append('date',selectedDate);
  fetch('/tools/diet_tool',{
    method:'POST',
    body:formData
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.blob();
  })
  .then((response) => {
    response.text().then(function (text) {
      const dietData=JSON.parse(text);
      var noDataFlag=true;
      Object.values(dietData).forEach(element => {
        if(element!==0){
          noDataFlag=false;
        }
      });
      if(!noDataFlag){
        document.getElementById('dateID').innerHTML=selectedDate;
        document.getElementById('dateID').classList.add('text-success');
        document.getElementById('dateID').classList.remove('text-danger');
        document.getElementById('noDataFound').classList.add('d-none');
        document.getElementById('receivedData').classList.remove('d-none');

        document.getElementById('dayCalories').innerHTML=dietData.calories;
        document.getElementById('dayProtien').innerHTML=dietData.protien;
        document.getElementById('dayCarbs').innerHTML=dietData.carbs;
        document.getElementById('dayFats').innerHTML=dietData.fats;


        const breakfastTag=document.getElementById('breakfastList');
        const lunchTag=document.getElementById('lunchList');
        const snacksTag=document.getElementById('snacksList');
        const dinnerTag=document.getElementById('dinnerList');

        if(dietData.breakfast.length>0){
          dietData.breakfast.forEach(food => {
            breakfastTag.innerHTML+="<p class='mb-1'>"+food.name+"- <span class='text-secondary fs-small'>"+food.quantity+"gm</span></p>"
          });
        }else{
          breakfastTag.innerHTML="<p class='text-danger'>No food added!</p>"
        }

        if(dietData.lunch.length>0){
          dietData.lunch.forEach(food => {
            lunchTag.innerHTML+="<p class='mb-1'>"+food.name+"- <span class='text-secondary fs-small'>"+food.quantity+"gm</span></p>"
          });
        }else{
          lunchTag.innerHTML="<p class='text-danger'>No food added!</p>"
        }

        if(dietData.snacks.length>0){
          dietData.snacks.forEach(food => {
            snacksTag.innerHTML+="<p class='mb-1'>"+food.name+"- <span class='text-secondary fs-small'>"+food.quantity+"gm</span></p>"
          });
        }else{
          snacksTag.innerHTML="<p class='text-danger'>No food added!</p>"
        }

        if(dietData.dinner.length>0){
          dietData.dinner.forEach(food => {
            dinnerTag.innerHTML+="<p class='mb-1'>"+food.name+"- <span class='text-secondary fs-small'>"+food.quantity+"gm</span></p>"
          });
        }else{
          dinnerTag.innerHTML="<p class='text-danger'>No food added!</p>"
        }



        resize();

      }else{
        document.getElementById('dateID').innerHTML=selectedDate;
        document.getElementById('dateID').classList.remove('text-success');
        document.getElementById('dateID').classList.add('text-danger');
        document.getElementById('noDataFound').classList.remove('d-none');
        document.getElementById('receivedData').classList.add('d-none');

        document.getElementById('breakfastList').innerHTML="";
        document.getElementById('lunchList').innerHTML="";
        document.getElementById('snacksList').innerHTML="";
        document.getElementById('dinnerList').innerHTML="";
        resize();
      }
    });
  });
}