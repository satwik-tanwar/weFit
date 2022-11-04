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
getProgressData(daysOfMonth);

function getProgressData(daysOfMonth){
  daysOfMonth.forEach(function(day){
    day.addEventListener('click',function(){
      getData(this);
    });
  });
}



document.querySelector(".prev").addEventListener("click", () => {
  addEntryDots();
  daysOfMonth=document.querySelectorAll('.curr');
  getProgressData(daysOfMonth);
});

document.querySelector(".next").addEventListener("click", () => {
  addEntryDots();
  daysOfMonth=document.querySelectorAll('.curr');
  getProgressData(daysOfMonth);
});


function addEntryDots(){
  const formData = new FormData();
  formData.append('date', date);

  fetch('/tools/progress_tracker/dataPoints',{
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
  fetch('/tools/progress_tracker',{
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
      const progressData=JSON.parse(text);
      var noDataFlag=true;
      Object.values(progressData).forEach(element => {
        if(element!==0){
          noDataFlag=false;
        }
      });
      if(!noDataFlag){
        console.log(progressData);
        document.getElementById('progressDataField').classList.remove('d-none');
        document.getElementById('noData').classList.add('d-none');

        for (var key in progressData) {
          if (progressData[key]!==0) {
            const val=progressData[key];

            if(key==='weight')
              document.getElementById('weightValue').innerHTML=val+' kg';
            if(key==='height')
              document.getElementById('heightValue').innerHTML=val+' cm';
            if(key==='bodyFat')
              document.getElementById('bodyFat').innerHTML=val+' %';
            if(key==='waistSize')
              document.getElementById('waistSize').innerHTML=val+' in';
            if(key==='chestSize')
              document.getElementById('chestSize').innerHTML=val+' in';
            if(key==='armSize')
              document.getElementById('armSize').innerHTML=val+' in';
            if(key==='quadSize')
              document.getElementById('quadSize').innerHTML=val+' in';
            if(key==='hipSize')
              document.getElementById('hipSize').innerHTML=val+' in';
          }else{
            if(key==='weight')
              document.getElementById('weightValue').innerHTML='N/A';
            if(key==='height')
              document.getElementById('heightValue').innerHTML='N/A';
            if(key==='bodyFat')
              document.getElementById('bodyFat').innerHTML='N/A';
            if(key==='waistSize')
              document.getElementById('waistSize').innerHTML='N/A';
            if(key==='chestSize')
              document.getElementById('chestSize').innerHTML='N/A';
            if(key==='armSize')
              document.getElementById('armSize').innerHTML='N/A';
            if(key==='quadSize')
              document.getElementById('quadSize').innerHTML='N/A';
            if(key==='hipSize')
              document.getElementById('hipSize').innerHTML='N/A';
          }
        }

      }else{
        document.getElementById('progressDataField').classList.add('d-none');
        document.getElementById('noData').classList.remove('d-none');
      }
    });
  });
}

