
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
