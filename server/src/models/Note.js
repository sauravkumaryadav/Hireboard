// Note Model - Mongoose schema for application notes & status change logs
// Fields: application (ref), user (ref), content, type (note/status_change), createdAt
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    //which application this note belongs to
    application: {
        type: Schema.Types.ObjectId,
        ref: "Application",
        required: true
    },
    // 👤 Who created the note
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        trim: true,
        required: true
    },
    // type of note
    type: {
        type: String,
        enum: ["note", "status_change"],
        default: "note"
    }

}, {
    timestamps: true
})

// indexing for faster queries
noteSchema.index({ application: 1, createdAt: -1 });
const Note = mongoose.model("Note", noteSchema);

export default Note;

/*
user table 
{
  "_id": "u1",
  "name": "Saurav"
}

Application table 
{
  "_id": "a1",
  "company": "Google",
  "user": "u1"
}

note table {
  "_id": "n1",
  "application": "a1",
  "user": "u1",
  "content": "HR said wait 1 week"
}
  Here:

"application": "a1" → links note to that job
"user": "u1" → ensures only that user owns the note

ObjectId = unique ID of a document
You use it to link collections together
ref = tells MongoDB which collection it belongs to
This creates relationships like:
User → Application → Notes

*/