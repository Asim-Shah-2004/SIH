import { User } from '../models/index.js';

export const sendConnectionRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const senderId = req.user.id;

    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(targetUserId),
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (
      sender.sentRequests.some((req) => req._id.toString() === targetUserId)
    ) {
      return res
        .status(400)
        .json({ message: 'Connection request already sent' });
    }

    if (
      sender.connections.some((conn) => conn._id.toString() === targetUserId)
    ) {
      return res.status(400).json({ message: 'Users are already connected' });
    }

    await Promise.all([
      User.findByIdAndUpdate(senderId, {
        $addToSet: { sentRequests: targetUserId },
      }),
      User.findByIdAndUpdate(targetUserId, {
        $addToSet: {
          receivedRequests: {
            _id: senderId,
            fullName: sender.fullName,
            bio: sender.bio,
            profilePhoto: sender.profilePhoto || null,
          },
          notifications: `${sender.fullName} sent you a connection request`,
        },
      }),
    ]);
    const updatedSender = await User.findById(senderId);
    res.json({
      message: 'Connection request sent successfully',
      user: updatedSender,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const accepterId = req.user.id;

    const [requester, accepter] = await Promise.all([
      User.findById(requesterId),
      User.findById(accepterId),
    ]);

    if (!requester || !accepter) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the request exists in receivedRequests
    if (
      !accepter.receivedRequests.some(
        (req) => req._id.toString() === requesterId
      )
    ) {
      return res.status(400).json({ message: 'No pending request found' });
    }

    await Promise.all([
      // Update the accepter's data
      User.findByIdAndUpdate(accepterId, {
        $pull: { receivedRequests: { _id: requesterId } }, // Remove the request
        $addToSet: {
          connections: {
            _id: requesterId,
            fullName: requester.fullName,
            bio: requester.bio,
            profilePhoto: requester.profilePhoto || null,
          },
          notifications: `You accepted ${requester.fullName}'s connection request`,
        },
      }),

      // Update the requester's data
      User.findByIdAndUpdate(
        requesterId,
        {
          $pull: { sentRequests: accepterId }, // Remove the request from sentRequests
          $addToSet: {
            connections: {
              _id: accepterId,
              fullName: accepter.fullName,
              bio: accepter.bio,
              profilePhoto: accepter.profilePhoto || null,
            },
            notifications: `${accepter.fullName} accepted your connection request`,
          },
        },
        { new: true }
      ),
    ]);

    const updatedAccepter = await User.findById(accepterId);
    res.json({ message: 'Connection request accepted', user: updatedAccepter });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const rejectConnectionRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const rejecterId = req.user.id;

    const [requester, rejecter] = await Promise.all([
      User.findById(requesterId),
      User.findById(rejecterId),
    ]);

    if (!requester || !rejecter) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the request exists in receivedRequests
    if (
      !rejecter.receivedRequests.some(
        (req) => req._id.toString() === requesterId
      )
    ) {
      return res.status(400).json({ message: 'No pending request found' });
    }

    await Promise.all([
      // Remove the request from rejecter's receivedRequests
      User.findByIdAndUpdate(rejecterId, {
        $pull: { receivedRequests: { _id: requesterId } },
      }),

      // Remove the request from requester's sentRequests and notify
      User.findByIdAndUpdate(
        requesterId,
        {
          $pull: { sentRequests: rejecterId },
          $addToSet: {
            notifications: `${rejecter.fullName} declined your connection request`,
          },
        },
        { new: true }
      ),
    ]);
    const updatedRejecter = await User.findById(rejecterId);
    res.json({ message: 'Connection request rejected', user: updatedRejecter });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate('connections', 'fullName email profilePhoto')
      .populate('sentRequests', 'fullName email profilePhoto')
      .populate('receivedRequests', 'fullName email profilePhoto');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      connections: user.connections,
      sentRequests: user.sentRequests,
      receivedRequests: user.receivedRequests,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
