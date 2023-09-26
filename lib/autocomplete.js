/**
 * Autocomplete functionality for an HTML element.
 *
 * @param {Element} editableElement - HTML element with contenteditable attribute.
 * @param {Array} suggestionValues - List of objects with "Display" properties for autocomplete.
 * @param {Function} onSelectCallback - Function to execute when a value is selected from the dropdown.
 */
function autocomplete(editableElement, suggestionValues, onSelectCallback) {
  let currentFocusIndex = -1;
  let userInput = '';

  /**
   * Adds the "active" class to the current item in the dropdown.
   *
   * @param {NodeList} dropdownItems - All available dropdown items.
   */
  function addActive(dropdownItems) {
    if (!dropdownItems) return false;
    removeActive(dropdownItems);
    if (currentFocusIndex >= dropdownItems.length) currentFocusIndex = 0;
    if (currentFocusIndex < 0) currentFocusIndex = dropdownItems.length - 1;
    dropdownItems[currentFocusIndex].classList.add("autocomplete-active");
    editableElement.innerText = userInput;
  }

  /**
   * Removes the "active" class from all items in the dropdown.
   *
   * @param {NodeList} dropdownItems - All available dropdown items.
   */
  function removeActive(dropdownItems) {
    for (let i = 0; i < dropdownItems.length; i++) {
      dropdownItems[i].classList.remove("autocomplete-active");
    }
  }

  /**
   * Closes all autocomplete dropdowns, except the one for the passed element.
   *
   * @param {Element} targetElement - Element to keep dropdown open for.
   */
  function closeAllLists(targetElement) {
    const openDropdowns = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < openDropdowns.length; i++) {
      if (targetElement !== openDropdowns[i] && targetElement !== editableElement) {
        openDropdowns[i].parentNode.removeChild(openDropdowns[i]);
      }
    }
  }

  // Event listener to listen for user input and populate dropdown
  editableElement.addEventListener("input", function (event) {
    showDropdown();
  });

  // New event listener for focus on the editable element
  editableElement.addEventListener("focus", function (event) {
    showDropdown();
  });

  // Function to show and populate dropdown based on input
  function showDropdown() {
    userInput = editableElement.innerText.trim();
    closeAllLists();
    currentFocusIndex = -1;
    const autocompleteContainer = document.createElement("div");
    autocompleteContainer.setAttribute("id", editableElement.id + "autocomplete-list");
    autocompleteContainer.setAttribute("class", "autocomplete-items");
    editableElement.parentNode.appendChild(autocompleteContainer);

    const itemLimit = 5;
    let itemCount = 0;
    const pattern = new RegExp("\\b(" + userInput + ")", "i");

    // Populate the dropdown with matching items.
    for (let i = 0; i < suggestionValues.length; i++) {
      if (suggestionValues[i].Display.search(pattern) >= 0) {
        itemCount++;
        if (itemCount <= itemLimit) {
          const suggestionDiv = document.createElement("div");
          suggestionDiv.classList.add("item");
          suggestionDiv.innerHTML = suggestionValues[i].Display.replace(pattern, "<strong>$1</strong>");
          suggestionDiv.addEventListener("click", function (event) {
            userInput = this.innerText;
            editableElement.innerText = userInput;
            closeAllLists();
            onSelectCallback(userInput);
          });
          autocompleteContainer.appendChild(suggestionDiv);
        }
      }
    }

    // Add footer with additional information and help link.
    const footer = document.createElement('span');
    const moreItems = itemCount - itemLimit;
    let moreItemsPrompt = '';
    if (itemCount === 0) {
      moreItemsPrompt = 'No matching items';
    } else if (moreItems === 1) {
      moreItemsPrompt = '1 more item';
    } else if (moreItems > 1) {
      moreItemsPrompt = `${moreItems} more items`;
    }
    footer.innerHTML = `<div class="d-flex justify-content-between"><span>${moreItemsPrompt}</span><span><a href="">Filtering Help</a></span></div>`;
    autocompleteContainer.appendChild(footer);
  }

  // Event listener for keyboard interactions.
  editableElement.addEventListener("keydown", function (event) {
    let dropdownItems = document.getElementById(editableElement.id + "autocomplete-list");
    if (dropdownItems) dropdownItems = dropdownItems.getElementsByClassName("item");
    // On KEY DOWN
    if (event.keyCode === 40) {
      currentFocusIndex++;
      addActive(dropdownItems);
    // On KEY UP
    } else if (event.keyCode === 38) {
      currentFocusIndex--;
      addActive(dropdownItems);
    // On ENTER (13), ESCAPE (27) or TAB (9)
    } else if (event.keyCode === 13 || event.keyCode === 27 || event.keyCode === 9) {
      event.preventDefault();
      // On ENTER when an item is selected, use the selected item
      if (currentFocusIndex > -1 && event.keyCode === 13) {
        if (dropdownItems) {
          userInput = dropdownItems[currentFocusIndex].innerText;
          onSelectCallback(userInput);
          userInput = "";
          editableElement.innerText = userInput;
        }
      }
      // On ENTER when there's only one item on the dropdown
      else if (event.keyCode === 13 && dropdownItems.length === 1) {
        userInput = dropdownItems[0].innerText;
        onSelectCallback(userInput);
        userInput = "";
        editableElement.innerText = userInput;
      }
      closeAllLists();
    }
  });

  // Close any open dropdown when clicking outside.
  document.addEventListener("click", function (event) {
    closeAllLists(event.target);
  });
}
