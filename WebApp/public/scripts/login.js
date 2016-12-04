/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
    // When the user clicks on the button, open the modal
    document.getElementById("buttonToShowLogin").onclick = function() {
        showModal();
        firebase.auth().signOut();
    }
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            hideErrorMessage();
            // User is signed in.
            var email = user.email;
            var displayName = email.split("@")[0];
            var emailVerified = user.emailVerified;
            document.getElementById('sign-in-status').textContent = displayName;
        } else {
            showModal();
            document.getElementById('sign-in-status').textContent = 'Sign In';
        }
    });
}

/* HELPER FUNCTIONS * HELPER FUNCTIONS * HELPER FUNCTIONS * HELPER FUNCTIONS * */

/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
        return false;
    } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
            setErrorMessage('Please enter an email address.');
            return false;
        }
        if (password.length < 4) {
            setErrorMessage('Please enter a password.');
            return false;
        }
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
            // success
        }).catch(function(error) { // unsuccessful login.
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode == 'auth/wrong-password') {
                setErrorMessage('Incorrect password.');
            } else {
                setErrorMessage(errorMessage);
            }
            console.log(error);
            showModal(); // show the login screen again
            // [END_EXCLUDE]
        });
        // does not mean successful login due to asynchronous login:
        return true;
        // [END authwithemail]
    }
}

function setErrorMessage(message) {
    $("#loginErrorContainer").show();
    $("#loginError").text(message);
}

function hideErrorMessage() {
    $("#loginErrorContainer").hide();
    $("#loginError").text("");
}

function showModal() {
    $('.ui.modal')
        .modal({
            blurring: true,
            closable  : false,
            onDeny    : function(){
                return false; // do not close.
            },
            onApprove : function() {
                if (toggleSignIn()) {
                    return true; // close modal.
                } else {
                    return false; // do not close.
                }
            }
        }).modal('show');
}