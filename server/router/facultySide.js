const express = require('express');
const router = express.Router();


// connection established
require('../mongoDb/connection');


// requiring user Schema                
const User = require('../model/userSchema');
const AppData = require('../model/applicationData');


router.post('/facultyInfoLoading', async (req, res) => {
    const { email } = req.body;
    console.log(email)
    try {
        const student = await User.findOne({ email: email })
        // if(student.role !== 1)
        return res.status(200).json(student);
        
    } catch (error) {
        console.log(error);
        return res.status(420).json({ message: "bad" });
    }
});
router.post('/fetchingNewApplicationFaculty', async (req,res) => {

    const {email } = req.body;
    try {
        const status = "0";
        const appData = await AppData.find({status: status});

        var filteredData = new Array();

        // const l = appData.length;
        // console.log(l);
        for (let i = 0; i <appData.length; i++) {
            const semail = appData[i].email;
            const user = await User.findOne({email: semail});
            // console.log(user);
            if(user.nameOfSupervisor === email)
            {
                // console.log(data);
                filteredData.push(appData[i]);
            }
          }
        // console.log(filteredData);
        // Debug Purpose
        // console.log(appData);
        // console.log(typeof(appData));        // Object
        // appData.forEach( (data) => {
        //     console.log(data._id + "\t" + data.nameOfConference);
        // })

        return res.status(200).json(filteredData);
    } catch (error) {
        console.log(error);
        return res.status(422).json("Error Occurred..");
    }
});
router.post('/approvedFacultyApplication', async (req, res) => {
    const { email } = req.body;
    try {
        const appData = await AppData.find();

        var filteredData = new Array();
        // console.log(appData);
        for (let i = 0; i < appData.length; i++) {
            const semail = appData[i].email;
            const user = await User.findOne({ email: semail });
            // console.log(user);
            if (user.nameOfSupervisor === email && appData[i].status !== "-1" && appData[i].status !== "0") {
                filteredData.push(appData[i]);
            }
        }
        return res.status(200).json(filteredData);
    } catch (error) {
        console.log(error);
        return res.status(422).json("Error Occurred..");
    }
});
router.post('/studentInfoFaculty', async (req, res) => {
    const {semail, femail } = req.body;
    
    try {
        const user = await User.findOne({ email: semail });
        if(user.nameOfSupervisor === femail)
        {
            const appData = await AppData.find({email: semail});
            return res.status(200).json(appData);
        }
        else
        {
            return res.status(421).json("not under your supervision..")
        }
    } catch (error) {
        console.log(error);
        return res.status(422).json("Error Occurred..");
    }
});
router.post('/applicationApproveOrDisapprove', async (req,res) => {
    const {id, status} = req.body;
    
    try {
        const appData = await AppData.findById(id);
        
        if(appData.status !== "0")
        {
            return res.status(422).json("Can't Approve Or Disapprove..");
        }

        await AppData.findByIdAndUpdate(id, {status: status});
        return res.status(200).json("Done")
    } catch (error) {
        console.log(error);
        return res.status(422).json("Error Occurred..");
             
    }
});

module.exports = router;