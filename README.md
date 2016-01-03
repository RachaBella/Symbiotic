# Symbiotic

## Synopsis
Symbiotic is an exchange plateforme, where users can exchange their knowledges with other users. 
After singning up/ loging in, a user can update his preferences (the knowledges he wants to learn, and the knowledges he knows) , the website will show him all the users that know the knowledges he is looking for. He can then send an invitation to those users, if they accept, they will then show up in the list of his mentors.
The user recieve the invitation, he can accept it or refuse it. If he accepts the invitation, that user will show up in the list of his mentees. 
The two users have then a dashboard, where they can share their Questions/Responses about a technology.

## Technologies used 
This project is built in NodeJs/Express, MongoDb as a back end, and AngularJs for front end. 

##  Using the code source
After forking this project to your repository : 
  npm install , to install all the dependencies |||
  mongod ||
  node server or nodemon

##Product backlog

**Sprint 1**
   * The user have to signUp/Login to use the functionalities of the website
   * The user can update his preferences by adding/deleting the knowledges he wants to learn , and those he knows
  
**Sprint 2**
   * The user can invite another user available in the list of users whom can be his mentors
   * A user can add/ refuse an invitation
  
**Sprint 3**
   * The user can choose one the users present in his list of mentors or mentees
   * The user can ask questions, or write answers in his shared dashboard with his mentor/mentee
   * The number of points of each user is incremented everytime he answers a question asked. (not implemented yet)

##Live website

