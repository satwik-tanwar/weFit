// -------------------- general ----------------------- //
document.getElementById("navbar").classList.remove('fixed-top');
document.getElementById("body").classList.remove('bodyPt');


// -------------------- compose ----------------------- //
const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;");
  tx[i].addEventListener("input", OnInput, false);
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















