/**
 * CardDrawer helps in creating and managing UI cards.


const containerElement = document.getElementById('containerID');
const card = new CardDrawer({
    title: 'Sample Card',
    icon: 'path/to/icon.png',
    severity: 'high'
}, containerElement);

card.draw({
    body: [
        { type: 'Values', data: [{ key: 'Age', value: 30 }, { key: 'Gender', value: 'Male' }] },
        { type: 'separator' },
        { type: 'text', data: 'Additional text here' },
        { type: 'image', data: 'path/to/image.png' },
        { type: 'Values', data: [{ key: 'Country', value: 'USA' }] }
    ]
});

 
 */
class CardDrawer {
    /**
     * Creates a new CardDrawer.
     * @param {Object} config - Configuration options for the card.
     * @param {HTMLElement} containerElement - The HTML element where the card will be drawn.
     */
    constructor(config, containerElement) {
        this.title = config.title;
        this.icon = config.icon;
        this.severity = config.severity;
        this.container = containerElement;
    }

    /**
     * Renders a card body item based on its type.
     * @param {Object|String} item - The item to be rendered in the card body.
     * @return {String} - HTML string representing the item.
     */
    renderBodyItem(item) {
        switch (item.type) {
            case 'Values':
                return `<div class="Values">${item.data.map(pair => `<span class="key">${pair.key}</span>: <span class="value">${pair.value}</span>`).join(', ')}</div>`;
            case 'separator':
                return '<hr>';
            case 'text':
                return `<p>${item.data}</p>`;
            case 'image':
                return `<img src="${item.data}" alt="Card image">`;
            default:
                return '';
        }
    }

    /**
     * Draws a card on the UI.
     * @param {Object} data - Data to populate the card.
     */
    draw(data) {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${this.severity || ''}`;

        const iconHTML = this.icon ? `<img src="${this.icon}" alt="${this.title} icon" class="card-icon">` : '';

        let bodyHTML = '';
        if (Array.isArray(data.body)) {
            bodyHTML = data.body.map(this.renderBodyItem).join('');
        }

        cardElement.innerHTML = `
            ${iconHTML}
            <h2>${this.title}</h2>
            <div class="card-body">
                ${bodyHTML}
            </div>
        `;

        this.container.appendChild(cardElement);
    }
}

