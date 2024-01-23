const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer')

//post ('/events',
const createEvent =  async (req, res) => {
    const { title, description, startDate, endDate, seats } = req.body;
    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate,
        endDate,
        seats,
      },
    });
    res.json(event);
  };
  
  // post Register Participant ('/events/:eventId/register',
 const registerParticipants =  async (req, res) => {
    const { eventId } = req.params;
    const { fullName, email } = req.body;
    //console.log(fullName, email +"---from function");
  
    const event = await prisma.event.findFirst({
      where: { id: parseInt(eventId) },
      include: { participants: true },
    });
  
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
  
    if (event.participants.length >= event.seats) {
      return res.status(400).json({ error: 'No more seats available' });
    }
  
    const participant = await prisma.participant.create({
      data: {
        fullName,
        email,
        eventId: parseInt(eventId),
      },
    });

    await prisma.event.update({
        where: { id: parseInt(eventId) },
        data: {
          registeredParticipantsCount: {
            increment: 1,
          },
        },
      });
  
    // Send confirmation email to the participant
    

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'mossie.daniel62@ethereal.email',
            pass: 'm25Kxp6yThf4UB5cpW'
        }
    });

    const mailOptions = {
      from: 'MICP - Event Manager',
      to: email,
      subject: 'Event Registration Confirmation',
      text: `You are successfully registered for the event "${event.title}"`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending confirmation email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  
    res.json(participant);
  };

const deleteExpiredEvents = async(req, res)=> {
  const currentDate = new Date();

  // Find events that have already ended
  const expiredEvents = await prisma.event.findMany({
    where: {
      endDate: {
        lte: currentDate,
      },
    },
  });

  // Delete each expired event
  for (const event of expiredEvents) {
    //first deleting all participants and then the event
    await prisma.participant.deleteMany({
      where: {
        eventId: event.id,
      },
    });

    await prisma.event.delete({
      where: {
        id: event.id,
      },
    });

    console.log(`Expired event "${event.title}" deleted.`);
  }
}
  
  //deleting the event 60 secs after expiration date/time
  const intervalInMilliseconds = 60 * 1000; // 60 secs intervall. (24 * 60 * 60 * 1000) - 24h
  setInterval(deleteExpiredEvents, intervalInMilliseconds);

  // app.js

// ... (previous code)

// Update Event
const updateEvent = async (req, res) => {
    const { eventId } = req.params;
    const { title, description, startDate, endDate, seats } = req.body;
  
    try {
      const updatedEvent = await prisma.event.update({
        where: { id: parseInt(eventId) },
        data: {
          title,
          description,
          startDate,
          endDate,
          seats,
        },
      });
  
      res.status(200).json({message: 'Event updated with success!', updatedEvent});
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  module.exports = {createEvent, registerParticipants, deleteExpiredEvents, updateEvent}
  