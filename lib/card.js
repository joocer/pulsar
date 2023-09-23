/**
 * CardDrawer helps in creating and managing UI cards.



const containerElement = document.getElementById('containerID');
const card = new CardDrawer({ /* config options */ }, containerElement);

card.draw({
    title: 'Sample Card',
    content: 'This is a sample content.',
    icon: 'path/to/icon.png',
    severity: 'high',
    body: [
        { type: 'keyValuePairs', data: [{ key: 'Age', value: 30 }, { key: 'Gender', value: 'Male' }] },
        { type: 'separator' },
        { type: 'keyValuePairs', data: [{ key: 'Country', value: 'USA' }] }
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
        this.config = config;
        this.container = containerElement;
    }

    /**
     * Renders a card body item based on its type.
     * @param {Object|String} item - The item to be rendered in the card body.
     * @return {String} - HTML string representing the item.
     */
    renderBodyItem(item) {
        if (item.type === 'keyValuePairs') {
            return `<div class="keyValuePairs">${item.data.map(pair => `<span class="key">${pair.key}</span>: <span class="value">${pair.value}</span>`).join(', ')}</div>`;
        }
        if (item.type === 'separator') {
            return '<hr>';
        }
        return '';
    }

    /**
     * Draws a card on the UI.
     * @param {Object} data - Data to populate the card.
     */
    draw(data) {
        const { title, content, body, icon, severity } = data;

        const cardElement = document.createElement('div');
        cardElement.className = `card ${severity || ''}`;

        const iconHTML = icon ? `<img src="${icon}" alt="${title} icon" class="card-icon">` : '';

        let bodyHTML = '';
        if (Array.isArray(body)) {
            bodyHTML = body.map(this.renderBodyItem).join('');
        }

        cardElement.innerHTML = `
            ${iconHTML}
            <h2>${title}</h2>
            <p>${content}</p>
            <div class="card-body">
                ${bodyHTML}
            </div>
        `;

        this.container.appendChild(cardElement);
    }
}
