const express = require('express');
const nedb = require('nedb-promise');
const cors = require('cors');
const app = express();

//säg till servern att alla får utnyttja vårt api
app.use(cors({origin: '*'}));
app.use(express.json());

//en databas för konton
const accountsDB = new nedb({filename: 'accounts.db', autoload: true});
//en databas för intressen länkade till ett konto
const interestsDB = new nedb({filename: 'interests.db', autoload: true});

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
    if ( usernameExists.length > 0) {
        responseObject.usernameExists = true
    }
    if (usernameExists) {
        responseObject.success = false
    } else {
        //om anv.namn är unikt och allt är fint - tjoffa in i db
        //hasha vårt lösenord via bcrypt lr liknande
        accountsDB.insert(credentials);
    }
    response.json(responseObject);
});
//logga in
//lägga till intressen
//hitta matchande intressen

//starta servern
app.listen(1234, () => {
    console.log('Server is running on port 1234');
})