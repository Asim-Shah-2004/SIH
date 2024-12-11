import { User, Group, Chat } from '../models/index.js';

export const createNewGroup = async (req, res) => {
  try {
    const { groupName, groupEmail, profilePhoto } = req.body;

    const group = new Group({
      fullName: groupName,
      email: groupEmail,
      profilePhoto,
    });

    const savedGroup = await group.save();

    const users = await User.find();
    const participantEmails = users.map((user) => user.email);

    const newChat = new Chat({
      participants: [groupEmail, ...participantEmails],
      chatType: true,
      messages: [],
      lastMessage: '',
      lastMessageTimestamp: new Date(),
    });

    const savedChat = await newChat.save();

    await User.updateMany(
      {},
      {
        $push: {
          chats: {
            chatId: savedChat._id,
            chatType: true,
            otherParticipant: groupEmail,
          },
        },
      }
    );

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
