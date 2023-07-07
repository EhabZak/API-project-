/// 1-create a test route, and export the router at the bottom of the file.
const express = require('express');
const router = express.Router();




///3- Import api-index file into the routes/index.js

const apiRouter = require('./api');

//4- connect api-index to the router

router.use('/api', apiRouter);

// 2-Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });




/// 5-export the router at the bottom of the file.
module.exports = router;
