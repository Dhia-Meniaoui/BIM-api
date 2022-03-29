const MaintenanceRequest = require('../../models/maintenance-request-model');
const Client = require('../../models/client-model');
const QualityControl = require('../../models/quality-control-model');
const TrainingSessionRequest = require('../../models/training-session-request-model')


// Post a maintenance request { client,authToken => none }
const addMaintenanceRequest = async function (req, res) {
    const owner = req.client._id;

    // if the client already had training session request on hold he
    // will not be allowed to make other requests
    const requestOnHold = await MaintenanceRequest.findOne({clientID: owner.clientID, isFixed: false});
    if (requestOnHold) {
        return res.status(412).send();
    }

    const maintenanceRequest = new MaintenanceRequest({owner});
    try {
        await maintenanceRequest.save();
        res.status(200).send();
    } catch (error) {
        res.status(400).send();
    }
}

// Get all unfixed maintenance requests { admin,authToken => maintenance }
const getMaintenanceRequests = async function (req, res) {
    let maintenanceRequests;
    try {
        let isFixed;
        if (req.query.fixed) {
            // if fixed is defined we return either fixed or unfixed maintenance requests
            isFixed = req.query.fixed === 'true';
            maintenanceRequests = await MaintenanceRequest.find({isFixed});
        } else {
            // if fixed is not defined we return all maintenance requests
            maintenanceRequests = await MaintenanceRequest.find({});
        }
        res.status(200).send(maintenanceRequests);
    } catch (error) {
        res.status(400).send()
    }
}

// Set a maintenance request as fixed { admin,authToken , maintenance request's ID => none }
const setMaintenanceRequestFixed = async function (req, res) {
    try {
        const maintenanceRequest = await MaintenanceRequest.findByIdAndUpdate(req.params.id, {isFixed: true});
        maintenanceRequest ? res.status(200).send() : res.status(404).send();
    } catch (error) {
        res.status(400).send();
    }
}

// Add quarterly control years { client,authToken , added years => none }
// !!! bad quality code and barely working, don't touch it !!!
const addQualityControlYears = async function (req, res) {
    try {
        await req.client.populate('qualityControl').execPopulate();
        let qualityControlSchedules = req.client.qualityControl;
        const addedMonths = req.body.addedYears * 4;
        // if client has no previous quality control contract or it's expired
        // we create a new array with dates separated by 3 months for the next added months period
        const lastControlTime = qualityControlSchedules.length > 0 ? new Date(qualityControlSchedules[0].schedules[qualityControlSchedules[0].schedules.length - 1].schedule).getTime() : 0;
        if (qualityControlSchedules.length === 0 || lastControlTime <= new Date().getTime()) {
            qualityControlSchedules = [];
            const today = new Date();
            const firstControlDate = today.setMonth(today.getMonth() + 3)
            const schedule = new Date(firstControlDate)
            qualityControlSchedules.push({schedule});
            for (let i = 1; i < addedMonths; i++) {
                const date = qualityControlSchedules[qualityControlSchedules.length - 1].schedule;
                const month = new Date(date).getMonth();
                const dateNext = new Date(qualityControlSchedules[qualityControlSchedules.length - 1].schedule);
                dateNext.setMonth(month + 3);
                const schedule = new Date(dateNext);
                qualityControlSchedules.push({schedule});
            }
            const qualityControl = new QualityControl({schedules: qualityControlSchedules, owner: req.client._id});
            await qualityControl.save();
        } else if (lastControlTime > new Date().getTime()) {
            for (let i = 1; i <= addedMonths; i++) {
                const date = qualityControlSchedules[0].schedules[qualityControlSchedules[0].schedules.length - 1].schedule;
                const month = new Date(date).getMonth();
                const dateNext = new Date(date);
                dateNext.setMonth(month + 3);
                const schedule = new Date(dateNext);
                qualityControlSchedules[0].schedules.push({schedule});
            }
            const qualityControlID = req.client.qualityControl[0]._id;
            await QualityControl.findByIdAndUpdate(qualityControlID, {schedules: qualityControlSchedules[0].schedules});
        }
        res.status(200).send();
    } catch (error) {
        res.status(400).send();
    }
}

// Get scheduled quality controls in the future for the client { client,authToken => all future schedules }
const getQualityControlsByClient = async function (req, res) {
    try {
        await req.client.populate('qualityControl').execPopulate();
        let schedules = req.client.qualityControl[0].schedules;
        const timeNow = new Date().getTime();
        schedules = schedules.filter((schedule) => {
            return new Date(schedule.schedule).getTime() > timeNow;
        });
        res.status(200).send(schedules);
    } catch (error) {
        res.status(400).send();
    }
}

// Get scheduled quality controls for all clients for next X days{ admin,authToken => none }
const getQualityControlsByAdmin = async function (req, res) {
    try {
        // Add the current time to time ahead wanted to wanted the time period wanted
        const timeAhead = req.query.days && !isNaN(req.query.days) ? (+req.query.days) * 24 * 3600000 : 0;
        const timeNow = Date.now();
        const timeWanted = new Date(timeNow + timeAhead).getTime();

        const qualityControls = await QualityControl.find();
        const allSchedules = [];
        const wantedSchedules = [];

        // We have multiple schedules arrays in multiple documents so parse them to create an
        // array with all our schedules objects
        qualityControls.forEach((QualityControlDocument) => {
            allSchedules.push(...QualityControlDocument.schedules);
        });

        // if no days were specified return all schedules
        if (timeAhead === 0) {
            allSchedules.forEach((scheduleObject) => {
                wantedSchedules.push(scheduleObject.schedule);
            })
            return res.status(200).send(wantedSchedules);
        }

        // We compare the schedules time to our requested time period and push the
        // wanted schedules in the wantedSchedules array
        allSchedules.forEach((scheduleObject) => {
            const scheduledTime = new Date(scheduleObject.schedule).getTime();
            if (scheduledTime > timeNow && scheduledTime < timeWanted) {
                wantedSchedules.push(scheduleObject.schedule);
            }
        });

        res.status(200).send(wantedSchedules);
    } catch (error) {
        res.status(400).send();
    }
}

// Add a training session request { client,authToken , request body {hours} => none }
const addTrainingSessionRequest = async function (req, res) {

    try {
        // if the client already had training session request on hold he
        // will not be allowed to make other requests
        const requestOnHold = await TrainingSessionRequest.findOne({clientID: req.client.clientID, isOnHold: true});
        if (requestOnHold) {
            return res.status(412).send();
        }

        const trainingSessionRequest = new TrainingSessionRequest(
            {
                ...req.body,
                phone: req.client.phone,
                name: req.client.name,
                email: req.client.email,
                clientID: req.client.clientID,
                country: req.client.country
            });
        await trainingSessionRequest.save();
        res.status(200).send();
    } catch (error) {
        res.status(400).send();
    }
}

// Get Training session requests { admin,authToken => training request }
const getTrainingSessionRequests = async function(req,res){
    try{
        const trainingRequests = await TrainingSessionRequest.find({isOnHold : true});
        res.status(200).send(trainingRequests);
    }catch (error) {
        res.status(400).send();
    }
}

// Set Training session requests as not in hold anymore { admin,authToken,request's ID => training request }
const setTrainingSessionAsDone = async function(req,res){
    try{
        const trainingSessionRequest = await TrainingSessionRequest.findByIdAndUpdate(req.params.id,
            {isOnHold : false});
        trainingSessionRequest ? res.status(200).send() : res.status(404).send();
    }catch (error) {
        res.status(400).send()
    }
}
module.exports = {
    addMaintenanceRequest,
    getMaintenanceRequests,
    setMaintenanceRequestFixed,
    addQualityControlYears,
    getQualityControlsByClient,
    getQualityControlsByAdmin,
    addTrainingSessionRequest,
    getTrainingSessionRequests,
    setTrainingSessionAsDone
};
