import Chat from '../models/chat.js';
import User from '../models/user.js';

const ERROR_MESSAGES = {
  CHAT_NOT_FOUND: 'Chat not found',
  INVALID_PARTICIPANTS: 'Invalid participants',
  UNAUTHORIZED: 'You are not authorized to access this chat',
  SERVER_ERROR: 'Internal server error',
};

export const getAllChats = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.chats || user.chats.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const chatIds = user.chats.map((chat) => chat.chatId);
    const otherParticipantsEmails = user.chats.map(
      (chat) => chat.otherParticipant
    );

    const [chatData, participants] = await Promise.all([
      Chat.find({ _id: { $in: chatIds } })
        .select('lastMessage lastMessageTimestamp participants')
        .lean(),
      User.find({ email: { $in: otherParticipantsEmails } })
        .select('email fullName profilePhoto')
        .lean(),
    ]);

    if (!chatData.length) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const result = chatData.map((chat) => {
      const otherParticipant = participants.find(
        (p) =>
          p.email ===
          chat.participants.find((email) => email !== req.user.email)
      ) || {
        fullName: 'Unknown',
        profilePhoto: null,
      };

      return {
        chatId: chat._id,
        otherParticipantName: otherParticipant.fullName,
        otherParticipantEmail: otherParticipant.email,
        profilePhoto: otherParticipant.profilePhoto,
        lastMessage: chat.lastMessage || '',
        lastMessageTimestamp: chat.lastMessageTimestamp || new Date(0),
      };
    });

    result.sort(
      (a, b) => (b.lastMessageTimestamp || 0) - (a.lastMessageTimestamp || 0)
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('getAllChats error:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
      error: error.message,
    });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { email } = req.user;
    const { page = 1, limit = 50 } = req.query;

    const chat = await Chat.findById(chatId).lean();

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.CHAT_NOT_FOUND,
      });
    }

    if (!chat.participants.includes(email)) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }

    // Get other participant's details
    const otherParticipantEmail = chat.participants.find((p) => p !== email);
    const otherParticipant = await User.findOne({
      email: otherParticipantEmail,
    })
      .select('fullName profilePhoto email')
      .lean();

    const totalMessages = chat.messages.length;

    // Calculate pagination from end of array since messages are in increasing order
    const endIndex = totalMessages - (Number(page) - 1) * Number(limit);
    const startIndex = Math.max(0, endIndex - Number(limit));

    // Get messages slice without sorting
    const paginatedMessages = chat.messages
      .slice(startIndex, endIndex)
      .reverse();

    const totalPages = Math.ceil(totalMessages / Number(limit));

    res.status(200).json({
      success: true,
      data: {
        messages: paginatedMessages,
        participant: otherParticipant || {
          fullName: 'Unknown',
          email: otherParticipantEmail,
          profilePhoto: null,
        },
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalMessages,
          hasMore: startIndex > 0,
        },
      },
    });
  } catch (error) {
    console.error('getChatMessages error:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
      error: error.message,
    });
  }
};

export const createNewChat = async (req, res) => {
  try {
    const { participantEmail } = req.body;
    const { email } = req.user;

    // Prevent self-chat
    if (participantEmail === email) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create chat with yourself',
      });
    }

    // Check if participant exists
    const participant = await User.findOne({ email: participantEmail });
    if (!participant) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_PARTICIPANTS,
      });
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      participants: { $all: [email, participantEmail], $size: 2 },
    });

    if (existingChat) {
      return res.status(200).json({
        success: true,
        data: existingChat,
      });
    }

    const newChat = new Chat({
      participants: [email, participantEmail],
      messages: [],
      lastMessage: '',
      lastMessageTimestamp: new Date(),
    });

    const savedChat = await newChat.save();

    // Add chat reference to both users
    await Promise.all([
      User.findOneAndUpdate(
        { email },
        {
          $push: {
            chats: {
              chatId: savedChat._id,
              otherParticipant: participantEmail,
            },
          },
        }
      ),
      User.findOneAndUpdate(
        { email: participantEmail },
        { $push: { chats: { chatId: savedChat._id, otherParticipant: email } } }
      ),
    ]);

    res.status(201).json({
      success: true,
      data: savedChat,
    });
  } catch (error) {
    console.error('createNewChat error:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
      error: error.message,
    });
  }
};
