const toggleList = document.querySelectorAll('.toggle');

toggleList.forEach(toggle => {
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
    })
})

const output     = document.querySelector('#rangevalue');
const rangeInput = document.querySelector('#slider');


rangeInput.addEventListener('input', (event) => {
    const min = rangeInput.min;
    const max = rangeInput.max;
    const val = rangeInput.value;

    rangeInput.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';

    output.innerHTML = val;
})