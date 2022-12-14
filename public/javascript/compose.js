// -------------------- general ----------------------- //
document.getElementById("navbar").classList.remove('fixed-top');
document.getElementById("body").classList.remove('bodyPt');


// -------------------- compose ----------------------- //
const tx = document.getElementsByTagName("textarea");

tx[0].setAttribute("style", "height:" + (tx[0].scrollHeight) + "px;");
tx[0].addEventListener("input", OnInput, false);

tx[0].onkeyup=function(){
  console.log(tx[0]);
}

function OnInput() {
  this.style.height='auto';
  this.style.height = (this.scrollHeight) + "px";
}

ClassicEditor.create( document.querySelector( '#post' ),{
  simpleUpload: {
    uploadUrl: '/learn/compose/upload',
  },
  placeholder: 'Lets Begin...',
  removePlugins:[
    'ImageCaption',
    'ImageResize',
    'ImageStyle',
    'ImageToolbar'
  ]
}).catch( error => {
      console.log( error );
  });


// -------------------- edit blog ----------------------- //
const editBlogTitle=document.getElementById('editBlogTitle').textContent;
var editBlogContent=document.getElementById('editBlogContent').textContent;

const parser = new DOMParser();
editBlogContent = parser.parseFromString(editBlogContent, 'text/html');
editBlogContent=editBlogContent.querySelector('body').innerHTML;

//console.log(editBlogContent);
window.addEventListener('load',function(){
  document.getElementById('title').value=editBlogTitle;
  document.getElementById('title').style.height=document.getElementById('title').scrollHeight+'px';

  const CKEDITOR = document.querySelector( '.ck-editor__editable' );
  CKEDITOR.ckeditorInstance.setData( editBlogContent );
  
});














