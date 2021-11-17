const delElement = document.querySelector('.delete-blog');
if( delElement ) {
    delElement.addEventListener('click', (event) => {
        const elemId = event.target.getAttribute('data-id');
        console.log(elemId);
        const xhr = new XMLHttpRequest();
        const url = '/blogs/'+elemId;
        xhr.open('DELETE', url);
        xhr.send();
        xhr.onreadystatechange=(e)=>{
            window.location.href = '/';
        }
    });
}
