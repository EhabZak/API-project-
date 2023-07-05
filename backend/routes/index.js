/// create a test route, and export the router at the bottom of the file.
const express = require('express');
const router = express.Router();



// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });





/// export the router at the bottom of the file.
module.exports = router;
