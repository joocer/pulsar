
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
