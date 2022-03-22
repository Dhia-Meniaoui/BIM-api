const multer = require('multer');
const TeamMember = require('../../models/team-member-model');

const fileStorage = multer.diskStorage({
    destination: ((req, file, callback) => {
        callback(null, 'public/images/team-members');
    }),
    filename(req, file, callback) {
        callback(null, new Date().getTime() + '_' + file.originalname);
    }
})
const uploadImage = multer({
    storage: fileStorage,
    limits: {fileSize: 5000000},
    fileFilter(req, file, callback) {
        if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|webp)/)) {
            return callback(new Error('File must be an image'));
        }
        return callback(null, true);
    }
});

// Add a team member { admin,authToken, team-member => none }
const addTeamMember = async function (req, res) {
    try {
        const teamMember = new TeamMember({...req.body, imageURL: '/images/team-members/' + req.file.filename});
        await teamMember.save();
        res.status(200).send();
    } catch (error) {
        res.status(400).send({error: error.toString()});
    }
}

// This function will catch the errors thrown by uploadImage() function , it must have 4 parameters
const addTeamMemberErrorCatcher = function (error, req, res, next) {
    res.status(400).send({error: error.message});
};

// Get one team member { admin,authToken, team-member's id => team-member }
const getTeamMember = async function (req, res) {
    try {
        const teamMember = await TeamMember.findById(req.params.id);
        teamMember ? res.status(200).send(teamMember) : res.status(404).send();
    } catch (error) {
        res.status(400).send();
    }
}

// Get all team members { none => team-members }
const getAllTeamMembers = async function (req, res) {
    try {
        const teamMembers = await TeamMember.find({}).sort({createdAt: 'asc'});
        res.status(200).send(teamMembers);
    } catch (error) {
        res.status(400).send()
    }
}

// Update a team member { admin,authToken, team-member's id , update body => updated team member }
const updateTeamMember = async function (req, res) {
    const updatesAllowed = ['name', 'post'];
    const updatesRequested = Object.keys(req.body);
    const isValidUpdate = updatesRequested.every((update) => {
        return updatesAllowed.includes(update);
    });
    if (!isValidUpdate) {
        return res.status(400).send({error: 'update is not valid'});
    }
    if (req.file) {
        req.body.imageURL = '/images/team-members/' + req.file.filename
    }
    try {
        const updatedTeamMember = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        updatedTeamMember ? res.status(200).send(updatedTeamMember) : res.status(404).send();
    } catch (error) {
        res.status(400).send();
    }
}

// Delete team member { admin,authToken, team-member's id => none }
const deleteTeamMember = async function (req, res) {
    try {
        const deletedTeamMember = await TeamMember.findByIdAndDelete(req.params.id);
        deletedTeamMember ? res.status(200).send() : res.status(404).send();
    } catch (error) {
        res.status(400).send();
    }
}


module.exports = {
    uploadImage,
    addTeamMember,
    addTeamMemberErrorCatcher,
    getTeamMember,
    getAllTeamMembers,
    deleteTeamMember,
    updateTeamMember
}
