const mongoose = require('mongoose');

const privateRoomSchema = new mongoose.Schema(
{
        "userId" : {
            type : String,
            required : [true , 'user id is required']
        },
        "room_id" : {
            type : String,
            required : [true , 'room id is required']
        },
        "room_price" : {
            type : String,
            required : [true , 'room price is required']
        },
        "room_msg_id" : {
            type : String,
            required : [true , 'room message id is required']
        },
        "room_duration" : {
            type : String,
            required : [true , 'room duration is required']
        },
        "room_createdAt" : {
            type : Date,
            required : [true , 'room creation date is required']
        },
        "room_endedAt" : {
            type : Date,
            required : [true , 'room final is required']
        },
        "room_status" : {
            type : String,
            default : "on"
        },
        "room_renew_msg_id" : {
            type : String
        }

},
{
  timestamps: true,
}
)

const privateRoomsModel = mongoose.model("privateRooms" , privateRoomSchema);
module.exports = {
    privateRoomsModel
}
