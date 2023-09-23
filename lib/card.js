/**
 * CardElement helps in creating and managing UI cards.


// Usage example
const containerElement = document.getElementById('containerID');
const card = new CardElement({
    title: 'Sample Card',
    severity: 'high'  // Optional, will default to 'information' if not specified
}, containerElement);

card.draw({
    body: [
        { type: 'values', data: [{ key: 'Age', value: 30 }, { key: 'Gender', value: 'Male' }] },
        { type: 'separator' },
        { type: 'text', data: 'Additional text here' },
        { type: 'image', data: 'path/to/image.png' },
        { type: 'link', target: 'https://www.example.com', text: 'Visit Example' },
        { type: 'badges', data: ['New', 'Featured'] }
    ]
});

 
 */
class CardElement {
    /**
     * Creates a new CardElement.
     * @param {Object} config - Configuration options for the card.
     * @param {HTMLElement} containerElement - The HTML element where the card will be drawn.
     */
    constructor(config, containerElement) {
        this.title = config.title;
        this.icon = config.icon || null;
        this.severity = config.severity || 'information';
        this.container = containerElement;
    }

    /**
     * Renders a card body item based on its type.
     * @param {Object|String} item - The item to be rendered in the card body.
     * @return {String} - HTML string representing the item.
     */
    renderBodyItem(item) {
        switch (item.type) {
            case 'values':
                return `<div class="values">${item.data.map(pair => `<span class="key">${pair.key}</span>: <span class="value">${pair.value}</span>`).join(', ')}</div>`;
            case 'separator':
                return '<hr>';
            case 'text':
                return `<p>${item.data}</p>`;
            case 'image':
                return `<img src="${item.data}" alt="Card image">`;
            case 'link':
                return `<a href="${item.target}" target="_blank">${item.text}</a>`;
            case 'badges':
                return `<div class="badges">${item.data.map(badge => `<span class="badge bg-primary">${badge}</span>`).join(' ')}</div>`;
            default:
                return '';
        }
    }

    /**
     * Draws a card on the UI.
     * @param {Object} data - Data to populate the card.
     */
    draw(data) {
        const wrapperElement = document.createElement('div');

        const iconHTML = this.icon ? `<img src="${this.icon}" alt="${this.title} icon" class="card-icon">` : '';

        const headerElement = document.createElement('h2');
        headerElement.innerHTML = `${iconHTML}${this.title}`;
        wrapperElement.appendChild(headerElement);

        const cardElement = document.createElement('div');
        cardElement.className = `card card-${this.severity}`;

        const bodyElement = document.createElement('div');
        bodyElement.className = 'card-body';

        if (Array.isArray(data.body)) {
            bodyElement.innerHTML = data.body.map(this.renderBodyItem.bind(this)).join('');
        }

        cardElement.appendChild(bodyElement);
        wrapperElement.appendChild(cardElement);

        this.container.appendChild(wrapperElement);
    }
}


