// Display AddToHome button for Chrome app
let deferredPrompt;
let btnAdd2Home = document.querySelector('.ad2hs-prompt');

if (btnAdd2Home) {

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        // e.preventDefault();

        // Stash the event so it can be triggered later.
        deferredPrompt = e;

        // Update UI notify the user they can add to home screen
        btnAdd2Home.style.display = 'block';
    });

    btnAdd2Home.addEventListener('click', (e) => {
        addToHomeScreen();
    });

    function addToHomeScreen() {
        btnAdd2Home.style.display = 'block';

        // Show the prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice
            .then(function (choiceResult) {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }

                deferredPrompt = null;
            });
    }

    // Determine if the app was successfully installed
    window.addEventListener('appinstalled', (evt) => {
        btnAdd2Home.style.display = 'none';
        app.logEvent('a2hs', 'installed');
    });
}
