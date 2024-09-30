// quizRoutes.js
const express = require("express");
const {
  createQuiz,
  getQuizByAdmin,
  assignQuizToUsers,
  assignQuizToEmails,
  assignQuizToLink,
  getAssignedQuizzes,
  getQuizWithQuestionsAndOptions,
  addQuestion,
  updateQuestion,
  getQuestionsByQuizId,
  saveUserAnswer,
  getQuizStats,
  submitQuiz,
  checkQuizCode,
  accessQuiz,
} = require("../../controllers/quizController");
const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createQuiz);
router.get("/quiz/:quizCode", authMiddleware, getQuizWithQuestionsAndOptions);
router.post("/answer", authMiddleware, saveUserAnswer);
router.get("/quiz/:quizId/stats", authMiddleware, getQuizStats);
router.post("/:quizCode/submit", authMiddleware, submitQuiz);
router.post("/quiz", authMiddleware, getQuizByAdmin);
router.post("/question/:questionId/edit", authMiddleware, updateQuestion);
router.get("/quiz/:quizId/questions", authMiddleware, getQuestionsByQuizId);
router.post("/:quizId/assign/users", authMiddleware, assignQuizToUsers);
router.post("/:quizId/assign/emails", authMiddleware, assignQuizToEmails);
router.post("/:quizId/assign/emails", authMiddleware, assignQuizToLink);
router.get("/assigned", authMiddleware, getAssignedQuizzes);
router.post("/:quizId/access", accessQuiz);
router.post("/code", authMiddleware, checkQuizCode);
router.post("/:quizId/add", addQuestion);

module.exports = router;
