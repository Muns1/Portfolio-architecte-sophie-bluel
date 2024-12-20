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
        createFilters(works);
        displayWorksInHomepage(works);
        displayWorksInModal(works);
    } catch (error) {
        console.error('Error fetching works:', error);
    }
}

// Dynamic Filter button creation
function createFilters(works) {
    const filtersContainer = document.querySelector('#filters');
    const categories = [
        { id: 'all', name: 'Tous' },
        { id: 1, name: 'Objets' },
        { id: 2, name: 'Appartements' },
        { id: 3, name: 'Hotels & Restaurants' }
    ];

    // Button creation for each category
    categories.forEach(category => {
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

