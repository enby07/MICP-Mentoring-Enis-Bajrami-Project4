const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer')

//post Create event
const createEvent = async (req, res) => {
  const { title, description, startDate, endDate, seats } = req.body;

  if (!title || !description || !startDate || !endDate || !seats) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
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
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// fetch an Event 

const getEvent = async (req, res) => {
    const { eventId } = req.params;
  
    try {
      const event = await prisma.event.findUnique({
        where: { id: parseInt(eventId) },
      });
  
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      res.json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  //Get all events

const getAllEvents = async (req, res) => {
    try {
      const events = await prisma.event.findMany();
  
      res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // post Register Participant 
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
  
    // registering participant
    const participant = await prisma.participant.create({
      data: {
        fullName,
        email,
        eventId: parseInt(eventId),
      },
    });



    //increses the number of participants by 1
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
            user: 'pinkie51@ethereal.email',
            pass: 'ZrAHyGDh1XAj44KPS1'
        }
    });

    const mailOptions = {
      from: 'MICP - Event Manager',
      to: email,
      subject: 'MICP - Event Registration Confirmation',
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

const deleteEvent = async (req, res) => {
    const { eventId } = req.params;
  
    try {
      // Check if the event exists
      const event = await prisma.event.findUnique({
        where: { id: parseInt(eventId) },
      });

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Delete the event
      //first deleting all participants and then the event
      await prisma.participant.deleteMany({
        where: {
          eventId: event.id,
        },
      });
      await prisma.event.delete({
        where: { id: parseInt(eventId) },
      });

      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

const deleteAllEvents = async (req, res) => {
    try {
      // Delete all events
      //first deleting all participants and then the event
      await prisma.participant.deleteMany();
      await prisma.event.deleteMany();

      res.json({ message: "All events deleted successfully" });
    } catch (error) {
      console.error("Error deleting events:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  module.exports = {createEvent, getEvent, getAllEvents, registerParticipants, deleteExpiredEvents, updateEvent, deleteEvent, deleteAllEvents}
  