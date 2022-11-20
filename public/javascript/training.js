// -------------------------- Style --------------------------- //

const sideBar=document.getElementById('sidebar');

function resize(){
  var availHeight=window.innerHeight-document.querySelector('footer').clientHeight-document.querySelector('nav').clientHeight+5;
  if((document.getElementById('rm-body').clientHeight+64<availHeight) && (document.getElementById('ex-body').clientHeight+64<availHeight) && (document.getElementById('workout-body').clientHeight+80<availHeight)){
    sideBar.style.height=Math.max(document.getElementById('menu').clientHeight,availHeight)+'px';
  }
  else{
    var cal=document.getElementById('calendar');
    var style = cal.currentStyle || window.getComputedStyle(cal);
    if(window.innerWidth>=768){
      var height;
      if(document.getElementById('rm-body').clientHeight>0)
        height=document.getElementById('rm-body').clientHeight
      else if(document.getElementById('ex-body').clientHeight>0)
        height=document.getElementById('ex-body').clientHeight
      else if(document.getElementById('workout-body').clientHeight>0)
        height=document.getElementById('workout-body').clientHeight+16

      sideBar.style.height=height+65+'px';
      document.getElementById('workout-list').style.marginLeft=0;
      
    }
    else{  
      sideBar.style.height=document.getElementById('menu').clientHeight+1+'px';
      document.getElementById('workout-list').style.marginLeft=style.marginLeft;
    }
  }
  
}
window.onload=resize;
window.onresize=resize;

const rmCalculator=document.getElementById('rmCalculator');
const exercise=document.getElementById('exercise');
const workout=document.getElementById('workout');

rmCalculator.onclick=function(){
  rmCalculator.classList.add('sidebar-active');
  exercise.classList.remove('sidebar-active');
  workout.classList.remove('sidebar-active');

  document.getElementById('rm-body').classList.remove('d-none');
  document.getElementById('ex-body').classList.add('d-none');
  document.getElementById('workout-body').classList.add('d-none');
  resize();
}

exercise.onclick=function(){
  rmCalculator.classList.remove('sidebar-active');
  exercise.classList.add('sidebar-active');
  workout.classList.remove('sidebar-active');

  document.getElementById('rm-body').classList.add('d-none');
  document.getElementById('ex-body').classList.remove('d-none');
  document.getElementById('workout-body').classList.add('d-none');
  resize();
}

workout.onclick=function(){
  rmCalculator.classList.remove('sidebar-active');
  exercise.classList.remove('sidebar-active');
  workout.classList.add('sidebar-active');

  document.getElementById('rm-body').classList.add('d-none');
  document.getElementById('ex-body').classList.add('d-none');
  document.getElementById('workout-body').classList.remove('d-none');
  resize();
}

// ----------------  1rm --------------------- //

var benchHistory=document.getElementById('bench-history');
var deadliftHistory=document.getElementById('deadlift-history');
var squatHistory=document.getElementById('squat-history');
var overheadHistory=document.getElementById('overhead-history');

fetch('/tools/training_tool/rm')
.then((response)=>response.text())
.then(function(text){
  const rmData=JSON.parse(text);
  if(typeof rmData.bench !== 'undefined'){
    benchHistory.innerHTML=rmData.bench+'kg';
  }
  if(typeof rmData.deadlift !== 'undefined'){
    deadliftHistory.innerHTML=rmData.deadlift+'kg';
  }
  if(typeof rmData.squat !== 'undefined'){
    squatHistory.innerHTML=rmData.squat+'kg';
  }
  if(typeof rmData.overhead !== 'undefined'){
    overheadHistory.innerHTML=rmData.overhead+'kg';
  }
})

var rmForm=document.getElementById('rm-calc');
rmForm.onsubmit=function(event){
  var weightLifted=Number(document.getElementById('weightLifted').value);
  var repsLifted=Number(document.getElementById('repsLifted').value);
  var exercise='Bench Press';
  if(document.getElementsByName('exercise')[1].checked){
    exercise='Deadlift';
  }else if(document.getElementsByName('exercise')[2].checked){
    exercise='Squat';
  }else if(document.getElementsByName('exercise')[3].checked){
    exercise='Overhead Press';
  }

  var rm=weightLifted/(1.0278-0.0278*repsLifted);
  document.getElementById('rm-res').classList.remove('d-none');
  document.getElementById('resExType').innerHTML=exercise;
  document.getElementById('rm-val').innerHTML=Math.round(rm);

  const formData=new FormData;
  formData.append('rmType', exercise);
  formData.append('rm', Math.round(rm));
  fetch('/tools/training_tool/rm',{
    method:"PUT",
    body: formData
  });
  
  event.preventDefault();
}


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
getWorkoutData(daysOfMonth);

function getWorkoutData(daysOfMonth){
  daysOfMonth.forEach(function(day){
    day.addEventListener('click',function(){
      getData(this);
    });
  });
}



document.querySelector(".prev").addEventListener("click", () => {
  addEntryDots();
  daysOfMonth=document.querySelectorAll('.curr');
  getWorkoutData(daysOfMonth);
});

document.querySelector(".next").addEventListener("click", () => {
  addEntryDots();
  daysOfMonth=document.querySelectorAll('.curr');
  getWorkoutData(daysOfMonth);
});


function addEntryDots(){
  const formData = new FormData();
  formData.append('date', date);

  fetch('/tools/training_tool/dataPoints',{
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
  fetch('/tools/training_tool/workoutData',{
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
      const workoutData=JSON.parse(text);
      var noDataFlag=true;
      Object.values(workoutData).forEach(element => {
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

        var workoutHistory=document.getElementById('workoutHistory');
        workoutData.exercises.forEach(exercise =>{
          workoutHistory.innerHTML+='<p class="mb-0">'+exercise.exName+'</p><p class="text-secondary fs-small">Sets:'+exercise.sets+', Reps: '+exercise.reps+'</p>'
        });

      }else{
        document.getElementById('dateID').innerHTML=selectedDate;
        document.getElementById('dateID').classList.remove('text-success');
        document.getElementById('dateID').classList.add('text-danger');
        document.getElementById('noDataFound').classList.remove('d-none');
        document.getElementById('receivedData').classList.add('d-none');
        document.getElementById('workoutHistory').innerHTML='';
      }
    });
  });
}