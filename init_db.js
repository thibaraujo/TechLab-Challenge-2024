import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const url = 'mongodb://mongodb:27017/database';

const UserSchema = new Schema({
  _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
  },
  username: {
      type: String,
      unique: true,
      required: true
  },
  email: {
      type: String,
      unique: true,
      required: true
  },
  password: {
      type: String,
      required: true,
      select: false
  },
  profile: {
      type: String,
      enum: ["sudo", "standard"],
      required: true
  },
  createdAt: {
      type: Date,
      default: Date.now,
      immutable: true
  },
  deletedAt: {
      type: Date,
      default: null
  },
  available: {
      type: Boolean,
  }
});

const User = mongoose.model('User', UserSchema);

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected successfully to MongoDB');

    // Adição de usuários iniciais
    const users = await User.find({});
    if (users.length == 0) {
      const sudoUser = new User({
        username: 'User Sudo',
        email: 'sudo@email.com',
        password: await bcrypt.hash("sudo", 10),
        profile: 'sudo',
        available: false,
      });

      const standardUser = new User({
        username: 'User Standard',
        email: 'standard@email.com',
        password: await bcrypt.hash("standard", 10),
        profile: 'standard',
        available: false,
      });
  
      await sudoUser.save();
      await standardUser.save();
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('An error occurred:', err);
    process.exit(1);
  }
}

main();
