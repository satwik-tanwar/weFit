// -------------------- general ----------------------- //
document.getElementById("navbar").classList.remove('fixed-top');
document.getElementById("body").classList.remove('bodyPt');


// -------------------- delete blog ----------------------- //

const deleteBlogBtn=document.getElementById('deleteBlogBtn');
deleteBlogBtn.addEventListener('click',function(){
  if(confirm("Are you sure you want to delete this blog?")){
    const linkArr=window.location.href.split('/');
    const blogID=linkArr.pop();

    var learnPageLink='';
    linkArr.forEach(element => {
      learnPageLink+=element+'/';
    });

    fetch('/learn/delete/'+blogID,{
      method:'PUT'
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.blob();
    })
    .then((response) => {
      response.text().then(function (text) {
        if(text==='deleted'){
          window.open(learnPageLink,"_self");
          alert("Blog has been successfully deleted.");
        }else{
          alert("There was some problem while deleting the blog, please try again.");
        }
      });
    });
  }
});