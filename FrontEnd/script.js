import { urlBackend } from "./services/variables.js";

// Wait for HTML content before fetchworks
document.addEventListener('DOMContentLoaded', () => {
    fetchWorks();
});

// Fetch Backend Data
async function fetchWorks() {
    try {
        const response = await fetch(`${urlBackend}/api/works`);
        const works = await response.json();
        await createFilters(works);
        displayWorksInHomepage(works);
        displayWorksInModal(works);
    } catch (error) {
        console.error('Error fetching works:', error);
    }
}

// Dynamic Filter button creation
async function createFilters(works) {
    try {
        const response = await fetch(`${urlBackend}/api/categories`);
        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }
        const categories = await response.json();

        // Add "All" category manually
        const allCategory = { id: 'all', name: 'Tous' };
        const allCategories = [allCategory, ...categories];

        const filtersContainer = document.querySelector('#filters');
        filtersContainer.innerHTML = '';

        // Create filter buttons dynamically
        allCategories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;
            button.dataset.id = category.id;
            button.addEventListener('click', () => {
                if (category.id === 'all') {
                    displayWorksInHomepage(works);
                } else {
                    const filteredWorks = works.filter(work => work.categoryId === category.id);
                    displayWorksInHomepage(filteredWorks);
                }
            });
            filtersContainer.appendChild(button);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Displaying works
const homepageGallery = document.querySelector('.gallery');
const modalGallery = document.querySelector('.modal-gallery');

function displayWorksInHomepage(works) {
    homepageGallery.innerHTML = '';
    works.forEach(work => {
        const figure = document.createElement('figure');
        figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        `;
        homepageGallery.appendChild(figure);
    });
}

function displayWorksInModal(works) {
    modalGallery.innerHTML = '';

    works.forEach(work => {
        const figure = document.createElement('figure');
        figure.style.position = 'relative';

        figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
        `;

        const trashIcon = document.createElement('i');
        trashIcon.className = 'fa-solid fa-trash-can';

        trashIcon.addEventListener('click', async () => {
            const confirmation = confirm("Êtes vous sûr de vouloir supprimer cette photo?");
            if (confirmation) {
                await deleteWork(work.id);
            }
        });

        figure.appendChild(trashIcon);
        modalGallery.appendChild(figure);
    });
}

async function deleteWork(workId) {
    const token = localStorage.getItem("authToken");

    if (!token) {
        console.error("Unauthorized: No token found.");
        return;
    }

    try {
        const response = await fetch(`${urlBackend}/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*'
            }
        });

        if (response.ok) {
            console.log("Image supprimé!");
            fetchWorks();
        } else {
            console.error(`Erreur de la suppression d'image. Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Erreur de la suppression d'image:", error);
    }
}


// Open/Close Modal
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const modifierBtn = document.getElementById('modifier-btn');

function openModal() {
    modal.classList.remove('hidden');
    modal.classList.add('show');
}

function closeModal() {
    modal.classList.remove('show');
    modal.classList.add('hidden');
}

modalClose.addEventListener('click', closeModal);

window.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

modifierBtn.addEventListener('click', openModal);



const addPhotoBtn = document.getElementById('add-photo-btn'); 
const addPhotoModal = document.getElementById('add-photo-modal');
const addPhotoModalClose = document.getElementById('add-photo-modal-close');


addPhotoBtn.addEventListener('click', () => {
  addPhotoModal.classList.add('show');
});


addPhotoModalClose.addEventListener('click', () => {
  addPhotoModal.classList.remove('show');
});


window.addEventListener('click', (event) => {
  if (event.target === addPhotoModal) {
    addPhotoModal.classList.remove('show');
  }
});

async function populateCategories() {
    try {
      const response = await fetch(`${urlBackend}/api/categories`);
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const categories = await response.json();
  
      const categoryDropdown = document.getElementById('category');
      categoryDropdown.innerHTML = '';
  
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categoryDropdown.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
  

  addPhotoBtn.addEventListener('click', populateCategories);


  document.getElementById('add-photo-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const form = event.target;
    const formData = new FormData(form);
  
    const token = localStorage.getItem("authToken");
  
    try {
      const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (response.ok) {
        const newWork = await response.json();
        console.log('New work added:', newWork);
  
        fetchWorks();
  
        document.getElementById('add-photo-modal').classList.remove('show');
        form.reset();
      } else {
        const error = await response.json();
        console.error('Error response:', error);
        alert('Failed.');
      }
    } catch (error) {
      console.error('Error adding new work:', error);
      alert('Error, try again later.');
    }
  });



  document.getElementById('image').addEventListener('change', function (event) {
    const file = event.target.files[0];
  
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
  
        // Load the image file
        reader.onload = function (e) {
          const preview = document.getElementById('image-preview');
          preview.src = e.target.result;
          preview.classList.remove('hidden');
        };
  
        reader.readAsDataURL(file);
      } else {
        alert('Please upload a valid image file.');
      }
    } else {
      document.getElementById('image-preview').classList.add('hidden');
      document.getElementById('image-preview').src = '';
    }
  });

  function isLoggedIn() {
    return localStorage.getItem('authToken') !== null;
  }
  
  function showRestrictedContent() {
    const restrictedElement = document.getElementById('restricted');
  
    if (restrictedElement) {
      if (isLoggedIn()) {
        console.log('User is logged in.');
        restrictedElement.style.display = 'block';
      } else {
        console.log('User is not logged in.');
        restrictedElement.style.display = 'none';
      }
    }
  }
  
  document.addEventListener('DOMContentLoaded', showRestrictedContent);