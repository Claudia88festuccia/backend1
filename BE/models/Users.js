import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified:{type:String,required:true},
    avatar:{type:String,required:true},

},
{collection:'users',timestamps:true}
)

UserSchema.pre("save", async function () {
    const user = this;

    if (user.isModified("password")) {
    const PlainPW=  user.password
   
    const hash = await bcrypt.hash(PlainPW, 10);
    user.password = hash;
    }
});

UserSchema.methods.toJSON = function () {
    const currentUser = this.toObject();
    delete currentUser.password
    delete currentUser.createdAt
    delete currentUser.updatedAt
    delete currentUser.__v
    return currentUser
    
};

UserSchema.static.checkCredentials = async function (email, PlainPW) {
    const user = await this.findOne({ email });
    if (user) {
        const isMatch = await bcrypt.compare(PlainPW, user.password);
        if (isMatch) {
            return user;
        }else{
            return null;
        }
    
        }else{
            return null;
        }
};

const Users = mongoose.model("Users", UserSchema);

export default Users;