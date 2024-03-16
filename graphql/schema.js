
import GraphQLJSON from "graphql-type-json"
export const typeDefs= `#graphql
    scalar JSON
    type User{
        User_Id:ID!
        User_Name:String
    }
    
    type Ticket{
        Ticket_Number:ID!
        Ticket_Description:String
        Ticket_Status:String
        Ticket_Priority:String
        Created_At:String
        Updated_At:String
        Created_By:User
        Assigned_To:User
    }
    type Comment{
        Comment_Id:ID!
        Ticket_Number:Int
        Commented_By:Int
        Commented_At:String
        Comment_Description:String!
    }
    type TicketDetails{
        Ticket:Ticket
        Comment:[Comment]
    }

    
    input TicketInput{
        Ticket_Description:String!
        Ticket_Status:String!
        Ticket_Priority:String!
        Created_By:Int!
        Assigned_To:Int!
    }

    input UserInput{
        User_Name:String!
    }

    input CommentInput{
        Ticket_Number:Int!
        Commented_By:Int!
        Comment_Description:String!
    }

    input TicketUpdateInput{
        Ticket_Number:Int!
        Ticket_Description:String
        Ticket_Status:String
        Ticket_Priority:String
        Assigned_To:Int

    }

    type Query{
        getUserDetails(userId:Int!):User
        getAllUserDetails:[User]
        getTicketDetails(ticketNumber:Int!):TicketDetails
    }
    type Mutation{
        createUser(user:UserInput!):User
        createTicket(ticket:TicketInput):Ticket
        updateTicket(ticket:TicketUpdateInput):Ticket
        deleteTicket(ticketNumber:Int!):Boolean
        createComment(comment:CommentInput):Comment
    }
`