const router = require('express').Router();
const {createEvent, registerParticipants, deleteExpiredEvents, updateEvent} =  require('../controllers/events')

router.post('/createEvent', createEvent);
router.post('/registerParticipants/:eventId/register', registerParticipants);
router.delete('/deleteExpiredEvents', deleteExpiredEvents);
router.put('/updateEvent/:eventId', updateEvent);

module.exports = router;