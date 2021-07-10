const priceSelector = document.querySelector('#price');
const num = document.querySelector('#live-num-validator')
priceSelector.addEventListener('input', (e) => {
    const val = e.target.value;
    if (isNum(val)) {
        if (!num.classList.contains('d-none')) {
            num.classList.add('d-none');
        }
        if (document.querySelector('#new-save').disabled)
            document.querySelector('#new-save').disabled = false;
    }
    else {
        if (num.classList.contains('d-none')) {
            num.classList.remove('d-none');
        }
        if (!document.querySelector('#new-save').disabled)
            document.querySelector('#new-save').disabled = true;

    }
})

const isNum = (str) => {
    let pointCount = 0;
    for (let char of str) {
        if (char == '.') {
            pointCount++;
            if (pointCount > 1) {
                return false;
            }
        }
        if (!(char == '.' || (char >= 0 && char <= 9))) {
            return false;
        }
    }
    return true;
}