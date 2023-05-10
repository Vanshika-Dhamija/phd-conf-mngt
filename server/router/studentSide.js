const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')


// connection established
require('../mongoDb/connection');

// requiring user Schema 
const User = require('../model/userSchema');
const AppData = require('../model/applicationData');


const { genAppToken } = require('../tokens/generateToken');
const searchDriveFolder = require('../driveUploadFunctions/searchFolder');
const createDriveFolder = require('../driveUploadFunctions/createFolder');
const uploadPdf = require('../driveUploadFunctions/uploadPdf');

// credentials import
require('dotenv').config();

// student info loading    
router.post('/studentInfoLoading', async (req, res) => {

    const bearerHeader = await req.headers["authorization"];
    if (!bearerHeader) {
        return res.status(422).json({ error: "No Header" });
    }
    var bearerToken = bearerHeader.split(" ")[1];

    // console.log( "Student Side Token: " + bearerToken);

    if (!bearerToken) {
        return res.status(422).json({ error: "No Token" });
    }

    // verfiy the token
    var decode
    try {
        decode = jwt.verify(bearerToken, process.env.JWT_SECRET)
    } catch (error) {
        console.log(error);
        return res.status(422).json({ error: error });
    }


    //setting email and role from decode
    const role = decode.role;
    const email = decode.email;


    // fetching data from mongo
    try {
        const student = await User.findOne({ email: email });
        return res.status(200).json(student);
    } catch (error) {
        console.log(error);
        return res.status(420).json({ message: "bad" });
    }
});

router.post('/updateInfo', async (req, res) => {

    const bearerHeader = await req.headers["authorization"];
    if (!bearerHeader) {
        return res.status(422).json({ error: "No Header" });
    }
    var bearerToken = bearerHeader.split(" ")[1];

    // console.log( "Student Side Token: " + bearerToken);

    if (!bearerToken) {
        return res.status(422).json({ error: "No Token" });
    }
    // verfiy the token
    var decode
    try {
        decode = jwt.verify(bearerToken, process.env.JWT_SECRET)
    } catch (error) {
        console.log(error);
        return res.status(422).json({ error: error });
    }


    //setting email and role from decode
    const role = decode.role;
    const email = decode.email;
    const { mobileNo } = req.body;

    try {
        await User.updateOne({ email: email }, {
            mobileNo: mobileNo
        });

        return res.status(200).json({ message: "Updated" });
    } catch (error) {
        console.log(error);
        return res.status(422).json({ message: "Erorr" });
    }

})

// submitting application 
router.post('/studentApplicationSubmit', async (req, res) => {

    var {
        email, entryNo,
        status, mobileNo,
        bankAccountNo, ifscCode,
        nameOfConference, venueOfConference, paperInConference,
        conferenceStarts, conferenceEnds,
        financialSupport,
        advances, finances,
        coaa, coaba, cocba,
        studentLeaveStarts, studentLeaveEnds, numberOfDays } = req.body;

    var copyOfAbstract, copyOfConferenceBrochure, copyOfAcceptance;

    if (coaa === true)
        copyOfAcceptance = req.files.copyOfAcceptance;
    if (cocba === true)
        copyOfConferenceBrochure = req.files.copyOfConferenceBrochure;
    if (coaba === true)
        copyOfAbstract = req.files.copyOfAbstract;


    finances = JSON.parse(finances);

    try {

        // searching for student folder
        const parentId = await searchDriveFolder(entryNo);
        // creating application folder inside student folder
        var applicationFolderName = conferenceStarts + "-" + conferenceEnds + "__" + nameOfConference; // name of application folder
        const applicationFolderId = await createDriveFolder(applicationFolderName, parentId);

        // uploading files to application folder
        var abstractFileId = null;
        if (copyOfAbstract)
            abstractFileId = await uploadPdf("copyOfAbstract.pdf", copyOfAbstract.tempFilePath, applicationFolderId);

        var brochureFileId = null;
        if (copyOfConferenceBrochure)
            brochureFileId = await uploadPdf("copyOfConferenceBrochure.pdf", copyOfConferenceBrochure.tempFilePath, applicationFolderId);

        var acceptanceFileId = null;
        if (copyOfAcceptance)
            acceptanceFileId = await uploadPdf("copyOfAcceptance.pdf", copyOfAcceptance.tempFilePath, applicationFolderId);

        // saving data to mongo
        const data = new AppData(
            {
                email, status,
                mobileNo,
                bankAccountNo, ifscCode,
                nameOfConference, venueOfConference, paperInConference,
                conferenceStarts, conferenceEnds,
                financialSupport,
                advances, finances,
                coaa, coaba, cocba,
                numberOfDays,
                studentLeaveStarts, studentLeaveEnds,
                abstractFileId, brochureFileId, acceptanceFileId
            });
        await data.save();

        return res.status(200).json({ message: "Application Submitted.." });
    } catch (error) {
        console.log(error);
        return res.status(422).json({ message: "Can't submit application. Try Again.." })
    }

});

// apps view
router.post('/studentApplicationView', async (req, res) => {

    // bearer header 'Bearer token'
    const bearerHeader = await req.headers["authorization"];

    if (!bearerHeader) {
        return res.status(422).json({ error: "No Header" });
    }
    var bearerToken = bearerHeader.split(" ")[1];

    // console.log( "Student Side Token: " + bearerToken);

    if (!bearerToken) {
        return res.status(422).json({ error: "No Token" });
    }

    // verfiy the token
    var decode
    try {
        decode = jwt.verify(bearerToken, process.env.JWT_SECRET)
    } catch (error) {
        console.log(error);
        return res.status(422).json({ error: error });
    }


    //setting email from decode
    const email = decode.email;
    const status = "0";
    try {
        // const data = await AppData.find({ email: email, status: status});
        // sorting acc to latest updated.. 
        const data = await AppData.find({ email: email }).sort({ "updatedAt": -1 });

        // console.log(data);
        return res.status(200).json(data);

    } catch (error) {
        console.log(error);
    }
})

//creating application token for viewing..
router.post('/createApplicationToken', async (req, res) => {

    const id = req.body.id;
    try {
        const token = await genAppToken(id);
        return res.status(200).json({ appToken: token });
    } catch (error) {
        return res.status(422).json({ error: "cant generate token.." });
    }
    // return res.status(200).json({id: id});
})




module.exports = router;

