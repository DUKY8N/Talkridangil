var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.redirect("/login");
});

router.get("/login", function (req, res, next) {
    res.render("login", { message: req.flash('error') });
});

// 유저 페이지

router.get('/signUp', function(req, res, next) {
  res.render('signUp', { message: req.flash('message') });
});

router.get("/home", function (req, res, next) {
	console.log('User ID in session:', req.session.passport.user);
	res.render("userHome");
});

router.get("/more-review", function (req, res, next) {
    // 데이터베이스에서 리뷰를 가져옵니다.
    req.app.locals.connection.query('SELECT * FROM review', function(error, reviews) {
        if (error) {
            // 에러 처리
            console.error(error);
            res.status(500).send('Database Error');
        } else {
            // 'moreReview' 템플릿에 리뷰 데이터를 전달하고 렌더링합니다.
            res.render("moreReview", { reviews: reviews });
        }
    });
});

router.get("/announce-read", function (req, res, next) {
	res.render("announceRead");
});

router.get("/review-read", function (req, res, next) {
	res.render("reviewRead");
});

router.get("/review-write", function (req, res, next) {
	res.render("reviewWrite");
});

function ensureAuthenticated(req, res, next) {
  console.log('ensureAuthenticated is called'); // ensureAuthenticated 함수가 호출되었음을 출력
  if (req.session && req.session.passport && req.session.passport.user) {
    return next();
  }
  res.redirect('/login');
}

router.get("/mypage", ensureAuthenticated, function (req, res, next) {
  var userId = req.session.passport.user;
  var connection = req.app.locals.connection;
  connection.query('SELECT * FROM user WHERE id = ?', [userId], function(err, results) {
    if (err) return next(err);
    var user = results[0];
    res.render("myPage", { user: user, message: req.flash('message') });
  });
});
// 관리자 페이지

router.get("/admin/announce-write", function (req, res, next) {
	res.render("announceWrite");
});

router.get("/admin/review-read", function (req, res, next) {
	res.render("reviewRead");
});

router.get("/admin/user-management", function (req, res, next) {
	res.render("userManagement");
});

module.exports = router;
