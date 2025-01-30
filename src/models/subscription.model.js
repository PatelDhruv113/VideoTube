import mongoose, {model, Schema}  from "mongoose";


const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, //one who is subscribing
        ref: "User"
    },
    channel: {       
        type: Schema.Types.ObjectId, //one to whom 'subscriber is subscribing'
        ref: "User"
    }
}, {timestamps: true})


export const Subscription = mongoose.model("Subscription", subscriptionSchema)

  /**
   koi channel=cac  na subscriber count karva hoy to "Docs mathi channel == "cac" find
   * 
   */

   /**
    user ae ketali channle ne subscrie karyu che te count karva ==
    subscriber=`c` value ne select kari channel ni list banvai do
    Ex: `c` => cac, hcc, fcc 
   * 
    */