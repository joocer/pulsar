/**
 * Autocomplete functionality for an HTML element.
 * 
 * This script provides autocomplete suggestions from a list of values
 * as the user types into the content-editable HTML element.
 * 
 * Usage:
 * autocomplete(element, values, clickAction);
 * - element: the HTML element with contenteditable attribute.
 * - values: an array of objects with a "Display" property to show in the dropdown.
 * - clickAction: a function to call when a dropdown item is selected.
 */

/**
 * Escapes special characters for use in a regular expression pattern.
 *
 * @param {string} str - String to clean.
 * @returns {string} - Escaped string.
 */
function cleanStringForTypingFilter(str) {
  return str.replace(/[\\()[\]'.-]/g, "\\$&");
}

/**
 * Main function to handle autocomplete functionality.
 *
 * @param {Element} element - HTML element with contenteditable attribute.
 * @param {Array} values - List of objects with "Display" properties for autocomplete.
 * @param {Function} clickAction - Function to execute when a value is selected from the dropdown.
 */
function autocomplete(element, values, clickAction) {
  let currentFocus = -1;
  let keyedText = '';

  /**
   * Adds active class to a dropdown item.
   *
   * @param {NodeList} x - List of dropdown items.
   */
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("autocomplete-active");
    element.innerText = keyedText;
  }

  /**
   * Removes active class from all dropdown items.
   *
   * @param {NodeList} x - List of dropdown items.
   */
  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  /**
   * Closes all open autocomplete dropdowns, except the one passed as an argument.
   *
   * @param {Element} elmnt - Element to keep open.
   */
  function closeAllLists(elmnt) {
    const x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (elmnt !== x[i] && elmnt !== element) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  // Listen for user input to update dropdown.
  // Listen for user input to populate and update dropdown.
  element.addEventListener("input", function (e) {
    // Update keyedText with current element's innerText.
    keyedText = element.innerText;

    // Variable declarations.
    let a, b, i, val = keyedText;

    // Close any existing autocomplete lists.
    closeAllLists();

    // Reset current focus.
    currentFocus = -1;

    // If no value is entered, exit early.
    if (!val) { return false; }

    // Create a new div element that will hold the autocomplete items.
    a = document.createElement("div");
    a.setAttribute("id", element.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");

    // Append the new div as a child to the autocomplete container.
    element.parentNode.appendChild(a);

    // Create regular expression pattern for matching.
    const re = new RegExp("\\b(" + cleanStringForTypingFilter(val) + ")", "i");

    // Loop through each item in the values array.
    for (i = 0; i < values.length; i++) {
      // If the item includes the typed text.
      if (values[i].Display.search(re) >= 0) {

        // Create a new div for each matching item.
        b = document.createElement("div");

        // Update innerHTML with highlighted matched text.
        b.innerHTML = values[i].Display.replace(re, "<strong>$1</strong>");

        // Add click event listener for the autocomplete item.
        b.addEventListener("click", function (e) {
          keyedText = this.innerText;
          element.innerText = keyedText;

          // Close the list of items and execute the action.
          closeAllLists();
          clickAction(keyedText);
        });

        // Append each div to the autocomplete list.
        a.appendChild(b);
      }
    }
  });


  // Listen for keydown events for navigation and selection.
  element.addEventListener("keydown", function (e) {
    let x = document.getElementById(element.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode === 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode === 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode === 13 || e.keyCode === 27 || e.keyCode === 9) {
      e.preventDefault();
      if (currentFocus > -1 && e.keyCode === 13) {
        if (x) {
          keyedText = x[currentFocus].innerText;
          clickAction(keyedText);
          keyedText = "";
          element.innerText = keyedText;
        }
      }
      closeAllLists();
    }
  });

  // Close dropdown when clicking outside.
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}
