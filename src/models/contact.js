import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: 3,
      maxlength: 20,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      minlength: 3,
      maxlength: 50,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['family', 'friend', 'work', 'other'],
      default: 'other',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
