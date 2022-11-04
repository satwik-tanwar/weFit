// --------------------- Like a post --------------------//
var idElements=document.getElementsByName('likeInp');
var ids=[];
for(var i=0;i<idElements.length;i++){
  ids.push(idElements[i].value);
}

var likeBtns=[];
ids.forEach(id => {
  likeBtns.push(document.getElementById(id));
});

for(var i=0;i<ids.length;i++){
  likeBtns[i].onclick=function(){
    if(Object.values(this.classList).indexOf('text-danger') > -1){
      var liked=true;
    }else{
      var liked=false;
    }
    var likeCount=document.getElementsByClassName(this.id)[0];
    
    if(liked){
      liked=false
      this.classList.add("fa-regular");
      this.classList.remove("fa-solid");
      this.classList.remove("text-danger");
      likeCount.innerHTML=Number(likeCount.innerHTML)-1;
  
      const formData = new FormData();
      formData.append('action','unlike');
      formData.append('postId',this.id);
      
      fetch('/liked',{
        method:'POST',
        body: formData
      })
    }
    else{
      liked=true;
      this.classList.remove("fa-regular");
      this.classList.add("fa-solid");
      this.classList.add("text-danger");
      likeCount.innerHTML=Number(likeCount.innerHTML)+1;
  
      const formData = new FormData();
      formData.append('action','like');
      formData.append('postId',this.id);
      
      fetch('/liked',{
        method:'POST',
        body: formData
      })
    }
  };
}


// --------------------- Accept/Reject follow request --------------------//

var reqIdElements=document.getElementsByName('reqInp');
var reqIds=[];
for(var i=0;i<reqIdElements.length;i++){
  reqIds.push(reqIdElements[i].value);
}

if(reqIds.length===0){
  document.getElementById('followReqBox').classList.add('d-none');
}

var acceptBtns=[];
var rejectBtns=[];
reqIds.forEach(id => {
  acceptBtns.push(document.getElementById(id+',accept'));
  rejectBtns.push(document.getElementById(id+',reject'));
});

console.log(acceptBtns);
console.log(rejectBtns);

for(var i=0;i<reqIds.length;i++){
  acceptBtns[i].onclick=function(){
    var id=this.id.split(',')[0];
    document.getElementById(id).classList.add('d-none');
    document.getElementById(id+',acceptedBtn').classList.remove('d-none')

    const formData = new FormData();
      formData.append('action','accept');
      formData.append('reqId',id);
      
    fetch('/reqResponse',{
      method:'POST',
      body: formData
    })
  };
  rejectBtns[i].onclick=function(){
    var id=this.id.split(',')[0];
    document.getElementById(id).classList.add('d-none');
    document.getElementById(id+',rejectedBtn').classList.remove('d-none')

    const formData = new FormData();
      formData.append('action','reject');
      formData.append('reqId',id);
      
    fetch('/reqResponse',{
      method:'POST',
      body: formData
    })
  };
}
