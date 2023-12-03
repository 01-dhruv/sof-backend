import Questions from "../models/Questions.js"
import mongoose from "mongoose"
import users from '../models/auth.js'

export const AskQuestion = async (req, res) => {
    const postQuestionData = req.body;
    const postQuestion = new Questions(postQuestionData)

    try {
        await postQuestion.save();

        const { userId: _id } = req.body;
        console.log('UserId:', _id); // Log to check if userId is properly extracted

        // Assuming you have userId in req.user after authentication
        const user = await users.findById(_id);

        if (user) {
            user.questions.push(postQuestion._id);
            console.log('console', postQuestion._id)
            const questionCount = user.questions.length;

            if (questionCount >= 5 && questionCount < 10) {
                user.points += 10;
            } else if (questionCount >= 10 && questionCount < 15) {
                user.points += 20;
            } else if (questionCount >= 15) {
                user.points += 30;
            }

            console.log(user.points);

            await user.save();
        }

        res.status(200).json('Posted a question Successfully')
    } catch (error) {
        console.log(error)
        res.status(409).json("Couldn't post a new question")

    }
}


export const getAllQuestions = async (req, res) => {
    try {
        const questionList = await Questions.find();
        // console.log(questionList)
        res.status(200).json(questionList);

    } catch (error) {
        res.status(404).json({message : error.message})
    }
}




export const deleteQuestion = async (req, res) => {
    const { id : _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send("Question Unavailable...")
    }
    try {
        await Questions.findByIdAndRemove(_id);
        res.status(200).json({message : "Successfully Deleted"});

    } catch (error) {
        res.status(404).json({message : error.message})
    }
}





export const voteQuestion = async (req, res) => {
    const { id : _id } = req.params;
    const { value, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send("Question Unavailable...")
    }

    try {
        const question = await Questions.findById(_id);
        const upIndex = question.upVote.findIndex( (id) => id === String(userId) )
        const downIndex = question.downVote.findIndex( (id) => id === String(userId) )

        if(value === 'upVote'){
            if(downIndex !== -1){
                question.downVote = question.downVote.filter( (id) => id !== String(userId) )
            }
            if(upIndex === -1){
                question.upVote.push(userId)
            }
            else{
                question.upVote = question.upVote.filter( (id) => id !== String(userId) )
            }
        }

        else if(value === 'downVote'){
            if(upIndex !== -1){
                question.upVote = question.upVote.filter( (id) => id !== String(userId) )
            }
            if(downIndex === -1){
                question.downVote.push(userId)
            }
            else{
                question.downVote = question.downVote.filter( (id) => id !== String(userId) )
            }
        }

        await Questions.findByIdAndUpdate( _id, question)
        res.status(200).json({message : "Voted Successfully"});


    } catch (error) {
        res.status(404).json({message : "Id not Found"})
    }
}