document.addEventListener("DOMContentLoaded", () => {
    console.log("page loaded");
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log("user is logged in");
            fetch("views/navbar.html")
                .then((response) => {
                    return response.text();
                }).then((html) => {
                    var gitauth;
                    db.collection("tokens").doc("1zGj3cwL0U47TLwagZU2").get().then((snapshot) => {
                        gitauth = snapshot.data().gitauth;
                    });
                    console.log(gitauth);
                    util.replace(util.qid("header"), html);
                    db.collection("users").doc(user.uid).get().then((snapshot) => {
                        data = snapshot.data().documents;
                        var navbar = util.qid("navbar");
                        data.forEach((id) => {
                            db.collection("documents").doc(id).get().then((snapshot) => {
                                navbar.innerHTML = navbar.innerHTML + '<div id="' + snapshot.data().endpoint + '" class="p-2 bg-yellow-700 hover:bg-yellow-800 cursor-pointer">' + snapshot.data().title + '</div>';
                            });
                    });
                    }).catch((e) => {
                        console.log(e);
                    });
                    util.on(util.qid("navbar"), "click", (el) => {
                        if (el.target.id == "logout-btn") {
                            auth.signOut();
                        } else {
                            console.log("git endpoint called");
                            var endpoint = el.target.id;
                            fetch("https://api.github.com/repos/robstonner/pf_campaign/contents/" + endpoint,
                                {
                                    method: "GET",
                                    headers: {
                                        "Accept": "application/vnd.github.v3+json",
                                        "Authorization": "TOKEN " + gitauth
                                    }
                                }
                            ).then((response) => {
                                return response.json();
                            }).then((md) => {
                                var html = util.mdf(atob(md.content));
                                document.getElementById("page-content").innerHTML = html;
                            }).catch((e) => {
                                console.log(e);
                            })
                        }
                    });
                    util.qid("navbar").style.display = "none";
                    util.on(util.qid("nav-btn"), "click", () => {
                        if (util.qid("navbar").style.display == "none") {
                            util.qid("navbar").style.display = "block";
                        } else {
                            util.qid("navbar").style.display = "none";
                        }
                    });
                });
        } else {
            util.clear(util.qid("page-content"));
            console.log("user is logged out");
            fetch("views/login.html")
                .then((response) => {
                    return response.text();
                }).then((html) => {
                    util.replace(util.qid("header"), html);
                    var username = document.getElementById("login-username");
                    var password = document.getElementById("login-password");
                    util.on(util.qid("login-btn"), "click", () => {
                        auth.signInWithEmailAndPassword(username.value, password.value).then((response) => {
                            console.log(response);
                        }).catch((e) => {
                            console.log("Error: " + e.code + ": " + e.message);
                            util.flash(util.qid("login-info"), "I don't know you");
                        });
                    });
                });
        }
    });
});