const url = 'https://apis.google.com/js/client.js?onload=__onGoogleLoaded';

export class GoogleAPILoader {
    private static promise;
    public static load() {

    // First time 'load' is called?
    if (!GoogleAPILoader.promise) {

        // Make promise to load
        GoogleAPILoader.promise = new Promise((resolve) => {

            // Set callback for when google maps is loaded.
            window['__onGoogleLoaded'] = (ev) => {
                console.log('google api loaded');
                resolve(window['gapi']);
            };

            // Add script tag to load google maps, which then triggers the callback, which resolves the promise with windows.google.maps.
            console.log('loading..');
            let node = document.createElement('script');
            node.src = url;
            node.type = 'text/javascript';
            document.getElementsByTagName('head')[0].appendChild(node);
        });
    }

    // Always return promise. When 'load' is called many times, the promise is already resolved.
    return GoogleAPILoader.promise;
    };
}