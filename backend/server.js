const express = require('express');
const nedb = require('nedb-promise');
const cors = require('cors');
const app = express();

//säg till servern att alla får utnyttja vårt api
app.use(cors({ origin: '*' }));
//eftersom vi kommer att skicka å ta emot json-data
app.use(express.json());

//en databas för konton
const accountsDB = new nedb({ filename: 'accounts.db', autoload: true });
//en databas för intressen länkade till ett konto
const interestsDB = new nedb({ filename: 'interests.db', autoload: true });

//skapa konto - endpoint
app.post('/signup', async (request, response) => {
    //vi kommer få in användarens anv.namn och lösen i en body
    const credentials = request.body;
    console.log(credentials);
    const responseObject = {
        success: true,
        usernameExists: false
    };
    //kolla igenom db om namnet som skickats in redan existerar
    const usernameExists = await accountsDB.find({ username: credentials.username });
    //.find() returnerar en lista på alla träffar
    if (usernameExists.length > 0) {
        responseObject.usernameExists = true
    }
    if (responseObject.usernameExists) {
        responseObject.success = false
    } else {
        //om anv.namn är unikt och allt är fint - tjoffa in i db
        //hasha vårt lösenord via bcrypt lr liknande
        accountsDB.insert(credentials);
    }
    response.json(responseObject);
});
//logga in
app.post('/login', async (request, response) => {
    const credentials = request.body;
    const responseObject = {
        success: true,
        user: '',
        interests: []
    };
    console.log(credentials);
    //kollar mot accountsDB om användare med namnet finns
    const account = await accountsDB.find({ $and: [{ username: credentials.username }, { password: credentials.password }] });
    if (account.length > 0) {
        //om vi fick iaf ett konto med träff
        //vill vi sedan checka lösenordet
        console.log('korrekt lösen ', account[0]);
        responseObject.user = account[0].username;
        //vi vill kolla om användaren har intressen
        const interestsRecord = await interestsDB.find({user: account[0].username});
        //om det finns; skicka med i responseobj
        if (interestsRecord.length > 0) {
            responseObject.interests = interestsRecord[0].interests;
        }
    } else {
        responseObject.success = false;
    }
    response.json(responseObject);
});
//lägga till intressen
app.post('/addinterest', async (request, response) => {
    const requestData = request.body;
    let userInterestObject = {
        user: requestData.user,
        interests: [requestData.interest]
    };
    console.log(userInterestObject);
    const responseObject = {
        success: true
    };
    //vi vill kolla om användaren redan har intressen inlagda
    const userHasInterests = await interestsDB.find({ user: userInterestObject.user });
    if (userHasInterests.length > 0) {
        //om det finns skall vi bara uppdatera dess record i interestDB
        let user = userHasInterests[0].user;
        interestsDB.update(
            { user: user },
            { $push: { interests: requestData.interest } }
        );
    } else {
        //om det inte finns, bara lägga in ett nytt record med anv.namn + intresselista
        interestsDB.insert(userInterestObject);
    }
    response.json(responseObject);
});
//hitta matchande intressen
app.post('/findmatch', async (request, response) => {
    const userInterestObject = request.body;
    const matches = await interestsDB.find(
        {
            interests: userInterestObject.interest,
            $not: { user: userInterestObject.user }
        }
    );
    response.json(matches);
});


//starta servern
app.listen(1234, () => {
    console.log('Server is running on port 1234');
});