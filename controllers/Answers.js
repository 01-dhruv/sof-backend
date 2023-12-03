import mongoose from "mongoose"
import Questions from "../models/Questions.js"
import users from '../models/auth.js'


export const postAnswer = async (req, res) => {
    const { id: _id } = req.params;
    const { noOfAnswers, answerBody, userAnswered, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send("Question Unavailable...")
    }

    updateNoOfQuestions(_id, noOfAnswers)
    try {
        const updatedQuestion = await Questions.findByIdAndUpdate( _id, { $addToSet: {'answer' : [{ answerBody, userAnswered, userId }]}})
        
        
        await updateAnswersAndPoints(userId);

        res.status(200).json(updatedQuestion)
    } catch (error) {
        return res.status(400).json(error)

    }
}



// export const postAnswer = async (req, res) => {
//     const { id: _id } = req.params;
//     const { answerBody, userAnswered, userId } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(_id)) {
//         return res.status(404).send('Question Unavailable...');
//     }

//     try {
//         // Create a new Answer object
//         const newAnswer = {
//             answerBody,
//             userAnswered,
//             userId,
//             answeredOn: Date.now(),
//         };

//         // Update the Question document by adding the new answer
//         const updateNoOfQuestions = await Questions.findByIdAndUpdate(
//             _id,
//             { $addToSet: { answer: newAnswer } },
//             { new: true }
//         );

//         // Update the user's answers array and points based on the number of answers
//         await updateAnswersAndPoints(userId);

//         res.status(200).json(updateNoOfQuestions);
//     } catch (error) {
//         console.error(error);
//         res.status(400).json({ message: 'Error posting answer' });
//     }
// };

const updateAnswersAndPoints = async (userId) => {
    try {
        const user = await users.findById(userId);

        if (user) {
            user.answers.push(userId); // Push the answer object, not just the user ID
            const answerCount = user.answers.length;

            if (answerCount >= 5 && answerCount < 10) {
                user.points += 10;
            } else if (answerCount >= 10 && answerCount < 15) {
                user.points += 20;
            } else if (answerCount >= 15) {
                user.points += 30;
            }

            await user.save();
        }
    } catch (error) {
        console.error(error);
    }
};











const updateNoOfQuestions = async (_id, noOfAnswers) => {
    try {
        await Questions.findByIdAndUpdate( _id, { $set: {'noOfAnswers' : noOfAnswers}})
    } catch (error) {
            console.group(error)
        }
}




export const deleteAnswer = async (req, res) => {
    const { id: _id } = req.params;
    const { answerId, noOfAnswers } = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send("Question Unavailable...")
    }
    if (!mongoose.Types.ObjectId.isValid(answerId)){
        return res.status(404).send("Answer Unavailable...")
    }
    updateNoOfQuestions(_id, noOfAnswers)
    try {
        await Questions.updateOne(
            { _id },
            { $pull: { 'answer': { _id: answerId }}}
        )
        res.status(200).json({message: 'Successfully deleted answer'})
    } catch (error) {
        res.status(405).json(error)
    }
}