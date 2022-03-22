const ComingEvent = require('../../models/coming-event-model');

const addEvent = async function (req, res) {
    try {
        const comingEvent = new ComingEvent(req.body);
        await comingEvent.save();
        res.status(200).send();
    } catch (error) {
        res.status(400).send({error: error.toString()});
    }
}

const getOneEvent = async function (req, res) {
    try {
        const event = await ComingEvent.findById(req.params.id);
        event ? res.status(200).send(event) : res.status(404).send();
    } catch (error) {
        res.status(400).send();
    }
}

const getManyEvents = async function (req,res){
    try {
        const limit = req.query.limit ? +req.query.limit : undefined;
        const events = await ComingEvent.find().limit(limit).sort({createdAt: 'asc'});
        res.status(200).send(events);
    }catch (error) {
        res.status(400).send();
    }
}

const deleteEvent = async function (req, res) {
    try {
        const deletedEvent = await ComingEvent.findByIdAndDelete(req.params.id);
        deletedEvent ? res.status(200).send() : res.status(404).send();
    } catch (error) {
        res.status(400).send();
    }
}

module.exports = {addEvent,getOneEvent,getManyEvents,deleteEvent}