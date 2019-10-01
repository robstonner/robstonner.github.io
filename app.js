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
                    util.replace(util.qid("header"), html);
                    db.collection("users").doc(user.uid).get().then((snapshot) => {
                        var bgColors = ["bg-red-800", "bg-teal-800", "bg-orange-700", "bg-green-700"];
                        data = snapshot.data().documents;
                        var navbar = util.qid("navbar");
                        var i = 0;
                        data.forEach((id) => {
                            var color = bgColors[i];
                            i++;
                            if (i > 3) {
                                i = 0;
                            }
                            db.collection("documents").doc(id).get().then((snapshot) => {
                                navbar.innerHTML = navbar.innerHTML 
                                    + '<div id="' 
                                    + snapshot.data().type + '@' 
                                    + snapshot.data().endpoint 
                                    + '" class="ml-3 mb-4 p-3 pl-5 ' 
                                    + color 
                                    + ' hover:text-yellow-500 cursor-pointer">' 
                                    + snapshot.data().title 
                                    + '</div>';
                            });
                    });
                    }).catch((e) => {
                        console.log(e);
                    });
                    util.qid("page-content").style.opacity = "1";
                    util.qid("zoom-in-btn").style.display = "none";
                    util.qid("zoom-in-btn").style.width = "0";
                    util.on(util.qid("navbar"), "click", (el) => {
                        util.qid("zoom-in-btn").style.display = "none";
                        if (el.target.id == "logout-btn") {
                            util.qid("page-content").style.opacity = "0";
                            auth.signOut();
                        } else if (el.target.id != "navbar") {
                            util.qid("page-content").style.opacity = "0";
                            console.log("git endpoint called");
                            var type = el.target.id.split('@')[0];
                            var endpoint = el.target.id.split('@')[1];
                            if (type == "md") {
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
                                    util.qid("page-content").style.display = "flex";
                                    console.log("page content acquired");
                                    var html = util.mdf(atob(md.content));
                                    util.qid("page-content").style.width = "100%";
                                    util.qid("page-content").style.height = "100%";
                                    util.qid("page-content").innerHTML = html;
                                    util.qid("page-content").style.opacity = "1";
                                }).catch((e) => {
                                    console.log(e);
                                });
                            } else if (type == "img") {
                                fetch("https://api.github.com/repos/robstonner/pf_campaign/git/blobs/" + endpoint,
                                    {
                                        method: "GET",
                                        headers: {
                                        "Accept": "application/vnd.github.v3+json",
                                        "Authorization": "TOKEN " + gitauth
                                    }
                                }
                                ).then((response) => {
                                    return response.json();
                                }).then((content) => {
                                    console.log("page content acquired");
                                    util.qid("page-content").innerHTML = 
                                    '<img id="img"'
                                    + ' class="flex-none self-center text-center"'
                                    + ' src="data:image/png;base64, ' 
                                    + content.content 
                                    + '" />';
                                    util.qid("page-content").style.width = "100vw";
                                    util.qid("page-content").style.height = "100vh";
                                    util.qid("page-content").style.opacity = "1";
                                    util.qid("zoom-in-btn").style.width = "auto";
                                    util.qid("zoom-in-btn").style.display = "block";
                                }).catch((e) => {
                                    console.log(e);
                                });
                            }
                        }
                    });
                    util.qid("navbar").style.width = "0vw";
                    util.qid("nav-bg").style.display = "none";
                    util.onall([util.qid("nav-btn"), util.qid("nav-bg")], "click", () => {
                        if (window.innerWidth >= 640) {
                            if (util.qid("navbar").style.width == "0vw") {
                                util.qid("navbar").style.width = "50vw";
                                util.qid("nav-bg").style.display = "block";
                            } else {
                                util.qid("navbar").style.width = "0vw";
                                util.qid("nav-bg").style.display = "none";
                            }
                        } else {
                            if (util.qid("navbar").style.width == "0vw") {
                                util.qid("navbar").style.width = "66vw";
                                util.qid("nav-bg").style.display = "block";
                            } else {
                                util.qid("navbar").style.width = "0vw";
                                util.qid("nav-bg").style.display = "none";
                            }
                        }
                    });
                    util.on(util.qid("zoom-in-btn"), "click", () => {
                        if (util.qid("img")) {
                            if (util.qid("img").style.maxHeight == "" || util.qid("img").style.maxHeight == "100%") {
                                util.qid("img").style.maxWidth = "none";
                                util.qid("img").style.maxHeight = "none";
                                util.qid("page-content").style.display = "block";
                                util.qid("zoom-icon").className = "glyphicon glyphicon-zoom-out";
                            } else {
                                util.qid("img").style.maxWidth = "100%";
                                util.qid("img").style.maxHeight = "100%";
                                util.qid("page-content").style.display = "flex";
                                util.qid("zoom-icon").className = "glyphicon glyphicon-zoom-in";
                            }
                        }
                    });
                });
        } else {
            util.qid("header").style.opacity = "0";
            util.clear(util.qid("page-content"));
            console.log("user is logged out");
            fetch("views/login.html")
                .then((response) => {
                    return response.text();
                }).then((html) => {
                    util.replace(util.qid("header"), html);
                    util.qid("header").style.opacity = "1";
                    var username = document.getElementById("login-username");
                    var password = document.getElementById("login-password");
                    util.on(util.qid("login-btn"), "click", () => {
                        auth.signInWithEmailAndPassword(username.value, password.value).catch((e) => {
                            console.log("Error: " + e.code + ": " + e.message);
                            util.flash(util.qid("login-info"), "I don't know you");
                        });
                    });
                });
        }
    });
});