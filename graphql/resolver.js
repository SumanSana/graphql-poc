import db from '../db/data.json' assert {type: "json"}
import { saveDataIntoJsonFile } from '../util/saveDataIntoJsonFile.js';
//import { DateResolver } from 'graphql-scalars';
import axios from 'axios';

export const resolvers = {
    //Date:DateResolver,
    Query: {
        getUserDetails: (_, { userId }) => {
            let user =  getUser(userId);
            if(!user)
                throw new Error('Bad Request, Give correct User_Id');
            return user;
        },
        getAllUserDetails: () => {
            return db.Users;
        },
        getTicketDetails: (_, { ticketNumber }) => {
            let Ticket = db.Tickets.find(ticket => ticket.Ticket_Number === ticketNumber);
            if(!Ticket){
                throw new Error('Bad Request, Give Correct Ticket_Number');
            }
            let Created_By = getUser(Ticket.Created_By);
            let Assigned_To = getUser(Ticket.Assigned_To);
            let Comments = db.Comments.filter(comment => comment.Ticket_Number === ticketNumber);
            Ticket = {
                ...Ticket,
                ...{ Created_By, Assigned_To }
            }
            Comments = Comments.map(comment => {
                return {
                    ...comment
                }
            })
            return {
                "Ticket": Ticket,
                "Comment": Comments
            }
        }
    },
    Mutation: {
        createUser: (_, { user }) => {
            db.sequence.userId++;
            const newUser = {
                User_Id: db.sequence.userId,
                ...user
            }
            db.Users.push(newUser);
            saveDataIntoJsonFile(db);
            return newUser;
        },
        createTicket: (_, { ticket }) => {
            db.sequence.ticketNumber++;
            if(!getUser(ticket.Created_By))
                throw new Error('Bad Request, Give correct Created_By User_Id');
            if(!getUser(ticket.Assigned_To))
                throw new Error('Bad Request, Give correct Assigned_To_User_Id');
            const newTicket = {
                Ticket_Number: db.sequence.ticketNumber,
                Created_At: new Date().toISOString(),
                Updated_At: new Date().toISOString(),
                ...ticket
            }
            db.Tickets.push(newTicket);
            saveDataIntoJsonFile(db);
            let Created_By = getUser(ticket.Created_By);
            let Assigned_To = getUser(ticket.Assigned_To);
            const response = {
                ...newTicket,
                ...{ Created_By, Assigned_To }

            }
            return response;
        },
        createComment: (_, { comment }) => {
            db.sequence.commentId++;
            const newComment = {
                Comment_Id: db.sequence.commentId,
                Commented_At: new Date().toISOString(),
                ...comment
            }
            db.Comments.push(newComment);
            saveDataIntoJsonFile(db);
            return newComment;
        },
        updateTicket: (_, { ticket }) => {
            let index = db.Tickets.findIndex(t => t.Ticket_Number === ticket.Ticket_Number);
            if(!getUser(ticket.Assigned_To))
                throw new Error('Bad Request, Give correct Assigned_To_User_Id');
            if (index === -1) {
                throw new Error('Bad Request, Give Correct Ticket_Number');
            }
            db.Tickets[index] = {
                ...db.Tickets[index],
                ...{ Updated_At: new Date().toISOString() },
                ...ticket
            }
            saveDataIntoJsonFile(db);
            let Created_By = getUser(db.Tickets[index].Created_By);
            let Assigned_To = getUser(db.Tickets[index].Assigned_To);
            const response = {
                ...db.Tickets[index],
                ...{ Created_By, Assigned_To }

            }
            return response;
        },

        deleteTicket(_, { ticketNumber }) {
            let index = db.Tickets.findIndex(t => t.Ticket_Number === ticketNumber);
            if (index === -1) {
                throw new Error('Bad Request, Give Correct Ticket_Number');
            }
            db.Tickets.splice(index, 1);
            saveDataIntoJsonFile(db);
            return true;

        }
    }
}

const getUser = (userId) => {
    return db.Users.find(user => user.User_Id === userId);
}




