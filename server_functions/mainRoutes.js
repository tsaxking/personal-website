const { Router } = require('express');

const locations = require("../locations");

const { temp } = locations;
const { stat } = locations;

const router = Router();

const routes = [
    "/thank-you",
    "/composition",
    "/composition/commissions",
    "/contact",
    "/home",
    "/about",
    "/about/portfolio",
    // "/about/projects/acceptance",
    // "/about/projects/desk",
    // "/about/projects/intonation",
    // "/about/projects/jazz-combo",
    // "/about/projects/live-tempo",
    "/about/contact",
    // "/home/about-me",
    "/lessons",
    "/lessons/saxophone",
    "/lessons/composition",
    "/other",
    "/other/take-note",
    "/other/score-editing",
    "/performance",
    "/recording-studio",
    "/recording-studio/recording",
    "/recording-studio/mixing",
    "/recording-studio/mockups",
    // "/accounts/sign-up",
    // "/accounts/create-account",
    // "/accounts/admin",
    "/covid-19"
]

router.get("/*", (req, res) => {
    if (routes.includes(req.url)) {
        const html = fs.readFileSync(temp + req.url + ".html");
        res.status(200).send(html);
    } else {
        res.status(404).send("Not Found");
    }
});

module.exports = router;