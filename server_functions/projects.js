const { Router } = require('express');
const locations = require("../locations");
const fs = require('fs');

const { temp } = locations;
const { stat } = locations;

const router = Router();

router.get('/:project', (req, res) => {
    const project = req.params;
    const html = fs.readFileSync(`${temp}/about/projects/${project}`);
    res.send(html);
});

module.exports = router;