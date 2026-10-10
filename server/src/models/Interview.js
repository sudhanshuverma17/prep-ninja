// import mongoose from "mongoose";

// const answerSchema = new mongoose.Schema(
//   {
//     question: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     answer: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     score: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 10,
//     },

//     feedback: {
//       type: String,
//       default: "",
//     },
//   },
//   {
//     _id: false,
//   }
// );

// const interviewSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },

//     role: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     domain: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     difficulty: {
//       type: String,
//       required: true,
//       enum: ["Beginner", "Intermediate", "Advanced"],
//       default: "Beginner",
//     },

//     questions: {
//       type: [String],
//       default: [],
//     },

//     answers: {
//       type: [answerSchema],
//       default: [],
//     },

//     finalScore: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 10,
//     },

//     status: {
//       type: String,
//       enum: ["pending", "completed"],
//       default: "pending",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Interview = mongoose.model("Interview", interviewSchema);

// export default Interview;



import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    feedback: {
      type: String,
      default: "",
    },

    improvement: {
      type: String,
      default: "",
    },

    correctAnswer: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    domain: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    questions: {
      type: [String],
      default: [],
    },

    answers: {
      type: [answerSchema],
      default: [],
    },

    finalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model(
  "Interview",
  interviewSchema
);

export default Interview;