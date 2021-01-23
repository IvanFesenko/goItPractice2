import Nexmo from 'nexmo';

const apiKey = "57147036";
const apiSecret = "TpSGRiBtfCeqo5qn";
const from = 'APIs finance';

const nexmo = new Nexmo({
    apiKey: apiKey,
    apiSecret: apiSecret,
});



export const sendMessage = ({phoneNumber, message, messageType = "ARN"}, callback) => {
    return nexmo.message.sendSms(from, phoneNumber, message, {}, callback)
}