const cron = require('node-cron')
const Todo = require('../../models/Todos')
const User = require('../../models/User')
const admin = require('../firebase-admin/admin')

exports.startCronReminder = () => {
    cron.schedule("* * * * *",async () => {
        const now = new Date()
        try {
            const dueTodos = await Todo.find({
                remindAt: {$lte: now,$ne :null},
                notificationId:null,
                todoStatus:{$ne:"Completed"}
            })
            for(const todoDoc of dueTodos) {
                const todo = todoDoc.toJSON();
                const user = await User.findById(todoDoc.userId);
                if(!user || !user.fcmTokens || user.fcmTokens.length === 0){
                    continue;
                }
                for(const token of user.fcmTokens){
                    try {
                        await admin.messaging().send({
                            token,
                            notification : {
                                title:"Reminder",
                                body:`Reminder for task: ${todo.todoTitle}`,
                            },
                        });
                    } catch (err) {
                        console.log("Reminder notification failed ", err)
                    }
                    todoDoc.notificationId = "sent";
                    await todoDoc.save();
                }
            }
        } catch (err) {
            console.log("Con error",err)
        }
    })
}
