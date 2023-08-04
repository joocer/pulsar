
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
