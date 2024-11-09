document.addEventListener('DOMContentLoaded', () => {
    fetchWorks();
});

function fetchWorks() {
    fetch('http://localhost:5678/api/works')
        .then(response => {
            return response.json();
        })
        .then(data => {
            displayWorks(data);
        });
}

function displayWorks(works) {
    const gallery = document.querySelector('.gallery'); 

    works.forEach(work => {
        const workItem = document.createElement('figure');
        workItem.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        `;
        gallery.appendChild(workItem);
    });
}