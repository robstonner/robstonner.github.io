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
                                navbar.innerHTML = navbar.innerHTML + '<div id="' + snapshot.data().endpoint + '" class="ml-3 mb-4 p-3 pl-5 ' + color + ' hover:text-yellow-500 cursor-pointer">' + snapshot.data().title + '</div>';
                            });
                    });
                    }).catch((e) => {
                        console.log(e);
                    });
                    util.qid("page-content").style.opacity = "1";
                    util.on(util.qid("navbar"), "click", (el) => {
                        if (el.target.id == "logout-btn") {
                            util.qid("page-content").style.opacity = "0";
                            auth.signOut();
                        } else if (el.target.id != "navbar") {
                            util.qid("page-content").style.opacity = "0";
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
                                console.log("page content acquired");
                                var html = util.mdf(atob(md.content));
                                util.qid("page-content").innerHTML = html;
                                util.qid("page-content").style.opacity = "1";
                            }).catch((e) => {
                                console.log(e);
                            })
                        }
                    });
                    util.qid("navbar").style.width = "0%";
                    util.qid("nav-bg").style.display = "none";
                    util.onall([util.qid("nav-btn"), util.qid("nav-bg")], "click", () => {
                        if (window.innerWidth >= 640) {
                            if (util.qid("navbar").style.width == "0%") {
                                util.qid("navbar").style.width = "50%";
                                util.qid("nav-bg").style.display = "block";
                            } else {
                                util.qid("navbar").style.width = "0%";
                                util.qid("nav-bg").style.display = "none";
                            }
                        } else {
                            if (util.qid("navbar").style.width == "0%") {
                                util.qid("navbar").style.width = "66%";
                                util.qid("nav-bg").style.display = "block";
                            } else {
                                util.qid("navbar").style.width = "0%";
                                util.qid("nav-bg").style.display = "none";
                            }
                        }
                    });
                    // util.on(util.qid("test"), "click", () => {
                    //     console.log("test endpoint called");
                    //     fetch("https://api.github.com/repos/robstonner/pf_campaign/git/blobs/acaf6dbf4ca37ebe997b99744c7db242208bd6d6",
                    //         {
                    //             method: "GET",
                    //             headers: {
                    //                 "Accept": "application/vnd.github.v3+json",
                    //                 "Authorization": "TOKEN " + gitauth
                    //             }
                    //         }
                    //     ).then((response) => {
                    //         return response.json();
                    //     }).then((content) => {
                    //         console.log("page content acquired");
                    //         console.log(content);
                    //         util.qid("image").src = "data:image/png;base64, " + content.content;
                    //     }).catch((e) => {
                    //         console.log(e);
                    //     });
                    // });
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