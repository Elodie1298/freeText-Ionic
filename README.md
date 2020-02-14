# freeText-Ionic

## Initialize the app
    npm install
**You must set the correct environment api's url**
(/app/environments/environments.ts) **before running it !**
<br>


## Run the app
### Run on the lab
    npm run lab
This will open a browser with a live view of the app. However, the 
application is made for android device, it may not work properly inside
a browser. Especially if the server-side is locally host, the request
will probably be blocked by the server for security reason.
<br>

### Run on an Android device
    npm run android-lr
This will run the application with the live reload feature. It enables
automatic reload at file change. In order to make live reload work, 
the device and the computer must be linked (check device recognition 
using `adb devices`) and connected to the same network.
<br>

### Build for Android
    npm run build-android
