import {http} from './http';
import {ui} from './ui';

document.addEventListener('DOMContentLoaded', getPosts);
document.querySelector('.post-submit').addEventListener('click', submitPost);
document.querySelector('#posts').addEventListener('click', onPostClick);
document.querySelector('.card-form').addEventListener('click', onCancelEdit);

function getPosts() {
  http.get('http://localhost:3000/posts')
    .then(data=>ui.showPosts(data))
    .catch(e=>console.log(e));
}

function submitPost() {
  const title = document.querySelector('#title').value;
  const body = document.querySelector('#body').value;
  const id = document.querySelector('#id').value;

  if(!title.length || !body.length) {
    ui.showAlert('Please fill in all fields', 'alert alert-danger');
    return;
  }

  const data = {
    title,
    body
  };

  if(id === '') {
    http.post('http://localhost:3000/posts', data)
      .then(data => {
        ui.showAlert('Post added', 'alert alert-success');
        ui.clearFields();
        getPosts();
      })
      .catch(e => console.log(e));
  } else {
    http.put(`http://localhost:3000/posts/${id}`, data)
      .then(data => {
        ui.showAlert('Post updated', 'alert alert-success');
        ui.changeFormState('add');
        getPosts();
      })
      .catch(e => console.log(e));
  }




}

function onPostClick(e) {
  e.preventDefault();
  const element = e.target.parentElement;
  if(element.classList.contains('delete')) {
    debugger;
    deletePost(element);
  } else if(element.classList.contains('edit')) {
    enableEditState(element);
  }
}

function deletePost(element) {
  const id = parseInt(element.dataset.id);
  if(confirm('Are you sure?')) {
    http.delete(`http://localhost:3000/posts/${id}`)
      .then(data => {
        ui.showAlert(data, 'alert alert-success');
        getPosts();
      })
      .catch(e => console.log(e));
  }
}

function enableEditState(element) {
  const id = element.dataset.id;
  const body = element.previousElementSibling.textContent;
  const title = element.previousElementSibling.previousElementSibling.textContent;
  const data = {
    id,
    title,
    body
  };
  ui.fillForm(data);
}

function onCancelEdit(e) {
  e.preventDefault();
  if(e.target.classList.contains('post-cancel')) {
    ui.changeFormState('add');
  }
}
