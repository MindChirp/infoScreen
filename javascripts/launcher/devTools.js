function developerSignIn() {
    //Set the localStorage criterias
    //This function is to bypass the conventional sign in method
    //thus freeing the developer from using the sign in server
    sS("signedIn", "true");

    var userInfo = ["OK",[{"name":"Developer User","email":"developer@gmail.com","creationDate":"2002-08-04T22:00:00.000Z","subscriber":1,"password":"developer123"}]];

    sS("userInfo", JSON.stringify(userInfo));
    sS("pfpPos", JSON.stringify([-50,0,1]));

    location.reload();
}

function sS(p1, p2) { //sS --> Shorthand for setStorage
    localStorage.setItem(p1, p2);
}