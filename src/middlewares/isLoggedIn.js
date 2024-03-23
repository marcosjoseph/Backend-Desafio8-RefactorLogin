export default function (req, res, next) {
    // if (!req.session.user) {
    //     next();
    // } else { res.redirect("/products")}

    console.log(req.isAuthenticated());
    if(req.isAuthenticated()) {
        res.redirect("/products")
    } else {next(); }
}