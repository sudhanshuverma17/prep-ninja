import Interview from "../models/Interview.js";
import {
  generateInterviewQuestions,
  evaluateAnswer,
} from "../services/geminiService.js";

/**
 * Create Interview
 * POST /api/interviews/create
 */
export const createInterview = async (req, res) => {
  try {
    const { role, domain, difficulty } = req.body;

    if (!role || !domain || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Role, domain and difficulty are required",
      });
    }

    const questions = await generateInterviewQuestions(
      role,
      domain,
      difficulty
    );

    const interview = await Interview.create({
      user: req.user.id || req.user._id,
      role,
      domain,
      difficulty,
      questions,
      answers: [],
      status: "pending",
      finalScore: 0,
    });

    res.status(201).json({
      success: true,
      message: "Interview created successfully",
      interview,
    });
  } catch (error) {
    console.error("Create Interview Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create interview",
      error: error.message,
    });
  }
};

/**
 * Get All User Interviews
 * GET /api/interviews
 */
export const getUserInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user.id || req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error("Get Interviews Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Single Interview
 * GET /api/interviews/:id
 */
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (
      interview.user.toString() !==
      (req.user.id || req.user._id).toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("Get Interview Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Submit Answer
 * POST /api/interviews/:id/answer
 */
export const submitAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required",
      });
    }

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const evaluation = await evaluateAnswer(question, answer);

    interview.answers.push({
      question,
      answer,
      score: evaluation.score,
      feedback: evaluation.feedback,
      improvement: evaluation.improvement,
      correctAnswer: evaluation.correctAnswer,
    });

    await interview.save();

    res.status(200).json({
      success: true,
      evaluation,
      interview,
    });
  } catch (error) {
    console.error("Submit Answer Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Complete Interview
 * POST /api/interviews/:id/complete
 */
export const completeInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    let totalScore = 0;

    interview.answers.forEach((answer) => {
      totalScore += answer.score || 0;
    });

    const averageScore =
      interview.answers.length > 0
        ? Math.round(totalScore / interview.answers.length)
        : 0;

    interview.finalScore = averageScore;
    interview.status = "completed";

    await interview.save();

    res.status(200).json({
      success: true,
      message: "Interview completed",
      finalScore: averageScore,
      interview,
    });
  } catch (error) {
    console.error("Complete Interview Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};