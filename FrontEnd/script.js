// Wait for HTML content before fetchworks
document.addEventListener('DOMContentLoaded', () => {
    fetchWorks();
});

// Fetch Backend Data
async function fetchWorks() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json();
        createFilters(works);
        displayWorks(works);
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
                displayWorks(works);
            } else {
                const filteredWorks = works.filter(work => work.categoryId === category.id);
                displayWorks(filteredWorks);
            }
        });
        filtersContainer.appendChild(button);
    });
}

// Displaying works
function displayWorks(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';

    works.forEach(work => {
        const workItem = document.createElement('figure');
        workItem.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        `;
        gallery.appendChild(workItem);
    });
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