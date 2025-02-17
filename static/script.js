let selectedType = 'decimal';

function selectTab(tabElement) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    // Add active class to the selected tab
    tabElement.classList.add('active');
    // Update the selected type
    selectedType = tabElement.getAttribute('data-type');
    updateInputFields();
}

function updateInputFields() {
    const inputFields = document.getElementById('inputFields');
    if (selectedType === 'ratio') {
        inputFields.innerHTML = `
            <div class="input-group">
                <input type="text" id="numerator" placeholder="Numerator">
                <span>:</span>
                <input type="text" id="denominator" placeholder="Denominator">
            </div>
        `;
    } else {
        inputFields.innerHTML = `
            <input type="text" id="probability" placeholder="Enter probability" class="shadcn-input">
        `;
    }
}

function findClosest() {
    let probability;
    if (selectedType === 'ratio') {
        const numerator = parseFloat(document.getElementById('numerator').value);
        const denominator = parseFloat(document.getElementById('denominator').value);
        if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
            probability = numerator / denominator;
        } else {
            document.getElementById('result').innerText = 'Invalid input. Please enter a valid ratio.';
            return;
        }
    } else {
        const inputValue = document.getElementById('probability').value;
        probability = parseProbability(inputValue, selectedType);
    }

    if (probability === null) {
        document.getElementById('result').innerText = 'Invalid input. Please enter a valid probability.';
        return;
    }

    fetch('/find', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ probability })
    })
    .then(response => response.json())
    .then(data => {
        const fraction = convertToFraction(data.probability);
        document.getElementById('result').innerHTML = `
            <div>
                <h2>${data.name}</h2>
                <p>Probability: ${fraction}</p>
            </div>
        `;
    })
    .catch(error => console.error('Error:', error));
}

function parseProbability(value, type) {
    switch (type) {
        case 'decimal':
            return parseFloat(value);
        case 'percentage':
            return parseFloat(value) / 100;
        default:
            return null;
    }
}

function convertToFraction(probability) {
    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    const denominator = 100;
    const numerator = Math.round(probability * denominator);
    const divisor = gcd(numerator, denominator);
    return `${numerator / divisor}/${denominator / divisor}`;
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

// Initialize input fields on page load
document.addEventListener('DOMContentLoaded', updateInputFields); 