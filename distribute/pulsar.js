
/* ****************************************************************************
 *
 *   Event Hooks
 *   =====================
 * 
 *   This is adapted from: https://code-boxx.com/create-javascript-hooks/
 * 
 *   Hooks allow some separation of concerns for functionality by allowing 
 *   pre and post functions, which would generally be UI-related, away from
 *   the actual doing, which would generally not be UI-related. For example
 *   you may have a pre function to a download that disabled the download
 *   button, and a post function that enabled the download button. Neither
 *   of these activities are actually part of the download. 
 * 
 *   See example:  
  
function download() {
    // call any hooked functions for this event
    Hooks.call("before_download");

    // do the download

    // call any hooked functions for this event
    Hooks.call("after_download");
}

// hook a function to this event
Hooks.add("before_download", function() {
    document.getElementById("download_button").enabled = false;
});
Hooks.add("after_download", function() {
    document.getElementById("download_button").enabled = true;
});

 **************************************************************************** */

var Hooks = {
    // The set of hooked events
    events: {},

    // Add a function call to list of events
    add: function(name, fn) {
        if (!Hooks.events[name]) {
            // If the event has no hooks, create an empty list
            Hooks.events[name] = [];
        }
        Hooks.events[name].push(fn);
    },

    // Call a hook
    call: function(name, ...params) {
        if (Hooks.events[name]) {
            // We can't control what's put into the hooks, so catch and log errors
            // but make sure they aren't fatal to us.
            Hooks.events[name].forEach(fn => {
                try {
                    fn(...params);
                } catch (e) {
                    console.warn(`Hook event ${name} failed - ${e}`);
                }
            });
        }
    }
};


/* ****************************************************************************
 *
 *   SPA router
 *   =====================
 * 
 *   The router allows for the URL in the address bar to be updated as
 *   users navigate around different functionality on the system. This 
 *   means that users can link back to specific pages, can share links
 *   and things like help pages can link to other places in help pages.
 * 
 *   This implementation is a hash-based SPA, this means that the URL
 *   is split in two by a hash (#), the part before the hash is the
 *   page retrieved from the server, the part after the hash is the
 *   part served by the router.
 *
 **************************************************************************** */

// Load the content of the page
function render_route(url, old_route, new_route) {
    if (old_route == new_route) { return; }

    var old_module = document.querySelector(`[route='${old_route}']`);
    if (old_module) {
        setVisibility(old_module, false);
    }

    var new_module = document.querySelector(`[route='${new_route}']`);
    if (new_module) {
        setVisibility(new_module, true);

        // Dispatch an event when the new page is displayed
        const transitionEvent = new CustomEvent('pageTransition', {
            detail: {
                oldRoute: old_route,
                newRoute: new_route
            }
        });
        window.dispatchEvent(transitionEvent);

        return;
    }

    // Using try...catch to handle errors during fetching and parsing.
    try {
        const doRouting = async() => {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const body = await response.text();
            setInnerHtml(document.getElementById("page-container"), body, new_route);

            // Dispatch an event after the new content is loaded
            const transitionEvent = new CustomEvent('pageTransition', {
                detail: {
                    oldRoute: old_route,
                    newRoute: new_route
                }
            });
            window.dispatchEvent(transitionEvent);
        }
        doRouting();
    } catch(e) {
        console.log('There was a problem with the fetch operation: ' + e.message);
    }
};


/* ****************************************************************************
 *
 *   State Manager
 *   =====================
 * 
 *   The State Manager is the Controller in a MVC pattern. The state that 
 *   is being managed is the Model and the UI is the View.
 * 
 *   The State Manager listens for changes to the Model and fires a function
 *   to redrawn the UI.
 * 
 *   One reason to use this mechanism, is to separate out any functionality
 *   relating to updating the UI from the data, and to allow each component
 *   to be maintained individually, is smaller, simpler bits of code. For
 *   example, a mailbox app can update both the table of messages and the
 *   counter of messages in separate, unrelated pieces of code by adding
 *   two event listeners to the state. 
 *
 **************************************************************************** */


// https://dev.to/logeekal/building-state-management-system-like-react-from-scratch-with-vanillajs-3eon


function StateManager(initialState, event) {
    this.state = initialState;
    this.event = event;

    const setStateInternal = (newState) => {
        this.state = newState;
    }

    this.setState = new Proxy(setStateInternal, {
        apply: function(target, thisArg, argumentList) {
            console.log('Previous state:', JSON.stringify(thisArg.state));
            target.apply(thisArg, argumentList);
            console.log('New state:', JSON.stringify(thisArg.state));

            let eventFired = window.dispatchEvent(new Event(thisArg.event));
            console.log(`Event "${thisArg.event}" fired: ${eventFired}`);
        }
    });
}

function createState(initialState, event) {
    console.log('Initializing state');
    let tempState = new StateManager(initialState, event);
    return tempState;
};
