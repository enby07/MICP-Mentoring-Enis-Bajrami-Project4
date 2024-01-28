const router = require('express').Router();
const {createEvent, getEvent, getAllEvents, registerParticipants, deleteExpiredEvents, updateEvent, deleteEvent, deleteAllEvents} =  require('../controllers/events')

router.post('/createEvent', createEvent);
router.get('/getEvent/:eventId', getEvent);
router.get('/getAllEvents', getAllEvents);
router.post('/registerParticipants/:eventId/register', registerParticipants);
router.delete('/deleteExpiredEvents', deleteExpiredEvents);
router.put('/updateEvent/:eventId', updateEvent);
router.delete('/deleteEvent/:eventId', deleteEvent);
router.delete('/deleteAllEvents/:eventId', deleteAllEvents);

module.exports = router;