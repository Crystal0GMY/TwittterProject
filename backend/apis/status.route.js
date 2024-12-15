const express = require('express');
const router = express.Router();
const statusModel = require('./db/status/status.model');
const jwtHelpers = require('./helpers/jwt')


router.get('/', async function(req, res) {
    const statusList = await statusModel.getAllStatus();
    res.send(statusList);
})

router.get('/getUserStatus/', async function(req, res) {

    const user = jwtHelpers.decrypt(req.cookies.statusToken);

    try {
        const statuses = await statusModel.findStatusByUsername(user);

        return res.send(statuses);


    } catch (error) {
        res.status(404)
        res.send("No staus with that username ");
    
    }

})

router.post('/', async function(req, res) {
    if(!req.body.statusText || req.body.statusText.trim() === '') {
        res.status(400);
        return res.send('Some values for new status update missing: ' + JSON.stringify(req.body));
    }

    let username;
    try {
        username = jwtHelpers.decrypt(req.cookies.statusToken);
    } catch (error) {
        console.error('Error decrypting token:', error);
        res.status(401).send('Invalid token.');
        return;
    }

    const newStatus = {
        username: username,
        statusText: req.body.statusText.trim(),
    };

    try {
        const statusDBResponse = await statusModel.insertStatus(newStatus);
        if (!statusDBResponse) {
            res.status(500).send('Failed to insert status.');
            return;
        }
        res.status(201).send(statusDBResponse);
    } catch (error) {
        console.error('Error inserting status:', error);
        res.status(500).send('Failed to insert status.');
    }
})

router.put('/edit/:id', async (req, res) => {
    const statusId = req.params.id;
    const { statusText } = req.body;

    try {
        const status = await statusModel.findStatusById(statusId);

        if (!status) {
            return res.status(404).send('Status not found');
        }
        
        status.statusText = statusText;
        status.createdTime = Date.now();
        await status.save();

        return res.send('Status updated successfully');
    } catch (error) {
        return res.status(500).send('Server error');
    }
});

router.delete('/delete/:id', async(req, res) => {
    const id = req.params.id;
    try {       
        await statusModel.deleteStatusById(id);

        return res.send('Status deleted successfully');
    } catch (error) {
        return res.status(500).send('Server error');
    }
})

module.exports = router;