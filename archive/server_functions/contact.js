const { Router } = require('express');
const locations = require("../locations");
const fs = require('fs');

const { temp } = locations;
const { stat } = locations;

const router = Router();

router.get('/*', (req, res) => {
    const html = fs.readFileSync(`${temp}${req.url}.html`);
    res.send(html);
});

module.exports = router;