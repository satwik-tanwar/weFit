const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;");
  tx[i].addEventListener("input", OnInput, false);
}

function OnInput() {
    this.style.height='auto';
  this.style.height = (this.scrollHeight) + "px";
}


document.getElementById("navbar").classList.remove('fixed-top');
document.getElementById("body").classList.remove('bodyPt');

ClassicEditor.create( document.querySelector( '#post' ),{
    simpleUpload: {
        // The URL that the images are uploaded to.
        uploadUrl: '/learn/compose/upload',

        // // Enable the XMLHttpRequest.withCredentials property.
        // withCredentials: true,

        // // Headers sent along with the XMLHttpRequest to the upload server.
        // headers: {
        //     'X-CSRF-TOKEN': 'CSRF-Token',
        //     Authorization: 'Bearer <JSON Web Token>'
        // }
    },
    placeholder: 'Lets Begin...',
}).catch( error => {
        console.log( error );
    } );

