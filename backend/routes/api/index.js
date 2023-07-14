const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require("../../utils/auth.js");
/// import spots ////////////////////////////////
const spotsRouter = require ('./spots.js');
////////////////////////////////////////////

///import reviews ////////////////////

const ReviewsRouter = require ('./reviews.js')
/////////////////////////////////////

///import review-images //////////////////

const reviewImagesRouter = require('./review-images.js')

/////////////////////////////////////////////

const spotImagesRouter = require ('./spot-images.js')
///////////////////////////////////////////////



router.use(restoreUser);

///////////////////////////////
router.use('/spot-images', spotImagesRouter);

///////////////////////////////
router.use('/spots', spotsRouter);
///////////////////

router.use('/review-images', reviewImagesRouter);
/////////////////////

router.use('/reviews', ReviewsRouter);
////////////////////////

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
