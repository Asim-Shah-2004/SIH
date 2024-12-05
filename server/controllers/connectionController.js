import { User } from '../models/index.js';

export const sendConnectionRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const senderId = req.user.id;

    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(targetUserId)
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    if (sender.sentRequests.includes(targetUserId)) {
      return res.status(400).json({ message: "Connection request already sent" });
    }

    if (sender.connections.includes(targetUserId)) {
      return res.status(400).json({ message: "Users are already connected" });
    }

    await Promise.all([
      User.findByIdAndUpdate(senderId, {
        $addToSet: { sentRequests: targetUserId }
      }),
      User.findByIdAndUpdate(targetUserId, {
        $addToSet: { 
          receivedRequests: senderId,
          notifications: `${sender.fullName} sent you a connection request`
        }
      })
    ]);

    res.json({ message: "Connection request sent successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const accepterId = req.user.id;

    const [requester, accepter] = await Promise.all([
      User.findById(requesterId),
      User.findById(accepterId)
    ]);

    if (!requester || !accepter) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!accepter.receivedRequests.includes(requesterId)) {
      return res.status(400).json({ message: "No pending request found" });
    }

    await Promise.all([
      User.findByIdAndUpdate(accepterId, {
        $pull: { receivedRequests: requesterId },
        $addToSet: { 
          connections: requesterId,
          notifications: `You accepted ${requester.fullName}'s connection request`
        }
      }),
      User.findByIdAndUpdate(requesterId, {
        $pull: { sentRequests: accepterId },
        $addToSet: { 
          connections: accepterId,
          notifications: `${accepter.fullName} accepted your connection request`
        }
      })
    ]);

    res.json({ message: "Connection request accepted" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const rejectConnectionRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const rejecterId = req.user.id;

    const [requester, rejecter] = await Promise.all([
      User.findById(requesterId),
      User.findById(rejecterId)
    ]);

    if (!requester || !rejecter) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!rejecter.receivedRequests.includes(requesterId)) {
      return res.status(400).json({ message: "No pending request found" });
    }

    await Promise.all([
      User.findByIdAndUpdate(rejecterId, {
        $pull: { receivedRequests: requesterId }
      }),
      User.findByIdAndUpdate(requesterId, {
        $pull: { sentRequests: rejecterId },
        $addToSet: { 
          notifications: `${rejecter.fullName} declined your connection request`
        }
      })
    ]);

    res.json({ message: "Connection request rejected" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      connections: user.connections,
      sentRequests: user.sentRequests,
      receivedRequests: user.receivedRequests
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
