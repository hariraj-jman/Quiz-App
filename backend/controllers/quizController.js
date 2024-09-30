// controllers/quizControllers.js
const prisma = require("../prismaClient");

// Helper function to generate a shareable link (for demonstration purposes)
const generateShareableLink = () => {
  // Implement a more robust link generation logic if needed
  return `https://example.com/quiz/${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to generate a random integer between min and max
const generateRandomInt = (min = 100000, max = 999999) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to generate a unique shareable integer code
const generateUniqueShareableCode = async () => {
  let code;
  let isUnique = false;

  while (!isUnique) {
    code = generateRandomInt();
    // Check if the code already exists in the database
    const existingQuiz = await prisma.quiz.findUnique({
      where: { shareableCode: code },
    });
    if (!existingQuiz) {
      isUnique = true; // Exit loop if the code is unique
    }
  }

  return code;
};

const createQuiz = async (req, res) => {
  const { title, description, assignmentType } = req.body;
  const createdBy = req.user.id;

  try {
    // Generate a unique sharable integer code
    const shareableCode = await generateUniqueShareableCode();

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        createdBy,
        assignmentType,
        responses: 0,
        shareableCode, // Add the unique sharable code
      },
    });
    console.log("Quiz Created : ", quiz.title);
    res.status(201).json(quiz);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Error creating quiz" });
  }
};

// Assign quiz to specific users
const assignQuizToUsers = async (req, res) => {
  const { quizId, userIds } = req.body;

  try {
    const userQuizzes = await prisma.userQuiz.createMany({
      data: userIds.map((userId) => ({
        userId,
        quizId,
      })),
    });
    res.status(200).json(userQuizzes);
  } catch (error) {
    res.status(400).json({ error: "Error assigning quiz to users" });
  }
};

// Assign quiz to specific emails
const assignQuizToEmails = async (req, res) => {
  const { quizId, emails } = req.body;
  const adminId = req.user.id; // Assume req.user is set by auth middleware

  try {
    const assignments = await prisma.emailAssignment.createMany({
      data: emails.map((email) => ({
        email,
        quizId,
        adminId,
      })),
    });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(400).json({ error: "Error assigning quiz to emails" });
  }
};

// Assign quiz to anyone with a link
const assignQuizToLink = async (req, res) => {
  const { quizId } = req.body;

  try {
    const quiz = await prisma.quiz.update({
      where: { id: quizId },
      data: { shareableLink: generateShareableLink() },
    });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ error: "Error assigning quiz with link" });
  }
};

// Get quizzes assigned to the current user
const getAssignedQuizzes = async (req, res) => {
  const userId = req.user.id; // Assume req.user is set by auth middleware

  try {
    const userQuizzes = await prisma.userQuiz.findMany({
      where: { userId },
      include: {
        quiz: true, // Include quiz details
        userAnswers: true, // Include user answers if needed
      },
    });
    res.status(200).json(userQuizzes);
  } catch (error) {
    res.status(400).json({ error: "Error fetching assigned quizzes" });
  }
};

// Access a quiz via link
const accessQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { email } = req.body;

  try {
    // Check if quiz is accessible via link
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(quizId) },
      select: { shareableLink: true },
    });

    if (!quiz || !quiz.shareableLink) {
      return res
        .status(404)
        .json({ error: "Quiz not found or not accessible" });
    }

    // Optionally, create a new entry in UserQuiz if the user should be tracked
    // Assuming you want to track quiz access, you may add logic here

    res.status(200).json({ message: "Access granted to quiz" });
  } catch (error) {
    res.status(400).json({ error: "Error accessing quiz" });
  }
};

const addQuestion = async (req, res) => {
  const { quizId, questionText, questionType, options } = req.body;

  try {
    const question = await prisma.question.create({
      data: {
        quizId,
        questionText,
        questionType,
        options: {
          create: options.map((option) => ({
            optionText: option.optionText,
            isCorrect: option.isCorrect,
          })),
        },
      },
    });
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: "Error adding question" });
  }
};

const getQuizByAdmin = async (req, res) => {
  const adminId = req.user.id;

  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        createdBy: adminId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        questions: {
          select: {
            id: true,
          },
        },
        responses: true,
        shareableCode: true,
        assignmentType: true,
      },
    });

    // Format the data to include the number of questions
    const formattedQuizzes = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      numberOfQuestions: quiz.questions.length,
      numberOfResponses: quiz.responses,
      shareableCode: quiz.shareableCode,
      assignmentType: quiz.assignmentType,
    }));

    res.status(200).json(formattedQuizzes);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error retrieving quizzes" });
  }
};

const getQuestionsByQuizId = async (req, res) => {
  const { quizId } = req.params;
  console.log("Getting Question");

  try {
    const questions = await prisma.question.findMany({
      where: {
        quizId: parseInt(quizId),
      },
      include: {
        options: true,
      },
    });

    if (!questions) {
      return res
        .status(404)
        .json({ error: "No questions found for this quiz" });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving questions" });
  }
};

// Update an existing question
const updateQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { questionText, questionType, options } = req.body;
  console.log(
    "Updating Question : ",
    questionId,
    questionText,
    questionType,
    options
  );

  try {
    // Update the question text and type
    const updatedQuestion = await prisma.question.update({
      where: { id: parseInt(questionId) },
      data: {
        questionText,
        questionType,
      },
    });

    // Fetch existing options for the question
    const existingOptions = await prisma.option.findMany({
      where: { questionId: parseInt(questionId) },
    });

    // Create a map of existing options for quick lookup
    const existingOptionsMap = existingOptions.reduce((acc, option) => {
      acc[option.id] = option;
      return acc;
    }, {});

    // Iterate over the provided options
    for (let option of options) {
      if (option.id) {
        // If option has an id, update it
        if (existingOptionsMap[option.id]) {
          await prisma.option.update({
            where: { id: option.id },
            data: {
              optionText: option.optionText,
              isCorrect: option.isCorrect,
            },
          });
          // Remove from map to identify deleted options later
          delete existingOptionsMap[option.id];
        }
      } else {
        // If option has no id, create it
        await prisma.option.create({
          data: {
            questionId: parseInt(questionId),
            optionText: option.optionText,
            isCorrect: option.isCorrect,
          },
        });
      }
    }

    // Delete options that were not included in the update
    for (let remainingOptionId in existingOptionsMap) {
      await prisma.option.delete({
        where: { id: parseInt(remainingOptionId) },
      });
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error updating question" });
  }
};

const checkQuizCode = async (req, res) => {
  const { quizCode } = req.body;
  try {
    // Find the quiz by shareable code
    const quiz = await prisma.quiz.findUnique({
      where: { shareableCode: parseInt(quizCode) },
    });

    if (!quiz) {
      return res
        .status(404)
        .json({ valid: false, message: "Invalid quiz code" });
    }

    // Check if the user has already taken the quiz
    const userQuiz = await prisma.userQuiz.findUnique({
      where: {
        userId_quizId: {
          userId: req.user.id,
          quizId: quiz.id,
        },
      },
    });

    if (userQuiz) {
      console.log("User has already taken the quiz");
      return res
        .status(200)
        .json({ valid: true, quizId: quiz.id, alreadyTaken: true });
    }

    console.log("User has not taken the quiz");
    res.status(200).json({ valid: true, quizId: quiz.id, alreadyTaken: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error checking quiz code" });
  }
};

const getQuizWithQuestionsAndOptions = async (req, res) => {
  const { quizCode } = req.params;

  try {
    // Fetch the quiz with its questions and options
    const quiz = await prisma.quiz.findUnique({
      where: { shareableCode: parseInt(quizCode) },
      include: {
        questions: {
          include: {
            options: true, // Include options for each question
          },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving quiz" });
  }
};

const saveUserAnswer = async (req, res) => {
  const { questionId, optionIds, userQuizId, quizCode } = req.body;

  try {
    console.log("Here", req.user);
    const quiz = await prisma.quiz.findUnique({
      where: { shareableCode: parseInt(quizCode) },
    });

    let userQuiz;
    if (userQuizId) {
      userQuiz = await prisma.userQuiz.findUnique({
        where: { id: userQuizId },
      });
    } else {
      userQuiz = await prisma.userQuiz.create({
        data: {
          quiz: {
            connect: { id: quiz.id },
          },
          user: {
            connect: { id: req.user.id },
          },
        },
      });
    }

    await prisma.userAnswer.deleteMany({
      where: {
        userQuizId: userQuiz.id,
        questionId: questionId,
      },
    });

    const answers = optionIds.map((optionId) => ({
      userQuizId: userQuiz.id,
      questionId,
      optionId,
    }));

    await prisma.userAnswer.createMany({ data: answers });

    res.status(200).json({ userQuizId: userQuiz.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error saving user answer" });
  }
};

const submitQuiz = async (req, res) => {
  const { userQuizId } = req.body;

  try {
    // Fetch the user's answers and the corresponding options
    const userAnswers = await prisma.userAnswer.findMany({
      where: { userQuizId },
      include: {
        option: true,
      },
    });

    // Calculate the score
    const correctAnswers = userAnswers.filter(
      (answer) => answer.option.isCorrect
    );
    const score = correctAnswers.length;

    // Update the UserQuiz with the score and completedAt timestamp
    await prisma.userQuiz.update({
      where: { id: userQuizId },
      data: { score, completedAt: new Date() },
    });

    // Fetch the quizId from the UserQuiz to update the Quiz responses count
    const userQuiz = await prisma.userQuiz.findUnique({
      where: { id: userQuizId },
      select: { quizId: true },
    });

    if (userQuiz) {
      // Increment the responses count for the quiz
      await prisma.quiz.update({
        where: { id: userQuiz.quizId },
        data: { responses: { increment: 1 } },
      });
    }

    res.status(200).json({ score });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error submitting quiz" });
  }
};

const getQuizStats = async (req, res) => {
  const { quizId } = req.params; // Get quizId from request parameters

  try {
    // Fetch all userQuiz records for the quiz
    const userQuizzes = await prisma.userQuiz.findMany({
      where: { quizId: parseInt(quizId) },
      include: {
        user: true, // Include user details
        userAnswers: {
          include: {
            option: true, // Include selected options
            question: true, // Include question details
          },
        },
      },
    });

    // Format the stats
    const stats = userQuizzes.map((userQuiz) => ({
      userId: userQuiz.user.id,
      username: userQuiz.user.username,
      score: userQuiz.score,
      answers: userQuiz.userAnswers.map((userAnswer) => ({
        questionId: userAnswer.questionId,
        optionId: userAnswer.optionId,
        optionText: userAnswer.option.optionText,
        isCorrect: userAnswer.option.isCorrect,
      })),
    }));

    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving quiz stats" });
  }
};

module.exports = {
  getQuizStats,
  addQuestion,
  submitQuiz,
  saveUserAnswer,
  createQuiz,
  checkQuizCode,
  getQuizByAdmin,
  getQuestionsByQuizId,
  assignQuizToUsers,
  assignQuizToEmails,
  assignQuizToLink,
  getAssignedQuizzes,
  accessQuiz,
  getQuizWithQuestionsAndOptions,
  updateQuestion, // Export the new function
};
