function getBaseUserRequest(platform, name)
{
    let request = new XMLHttpRequest();

    request.open("GET", `https://apextab.com/api/search.php?platform=${platform}&search=${name}`, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("Authorization", "Bearer QmtAHfQHsllSpqRSApAGay32yR2rL1k0uB7XRpHadlk")
    request.setRequestHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    request.onreadystatechange = () => {
        if (request.readyState == 4 && request.status >= 200 && request.status < 300) {
            console.log("Request Post: " + request.responseText);            
        }
    }

    request.send();
}

function getUserResquest(aid)
{
    let request = new XMLHttpRequest();

    request.open("GET", `https://apextab.com/api/search.php?aid=${aid}`, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("Authorization", "Bearer QmtAHfQHsllSpqRSApAGay32yR2rL1k0uB7XRpHadlk")
    request.onreadystatechange = () => {
        if (request.readyState == 4 && request.status >= 200 && request.status < 300) {
            console.log("Request Post: " + request.responseText);            
        }
    }

    request.send();
}