const mongoose = require('mongoose');

const employeeDetails = new mongoose.Schema({

    Name_of_candidate:{
        type:String,
        default:""
    },
    email:{
        type:String,
        default:""
    },
    mobile_no:{
        type:String,
        default:""
    },
    date_of_birth:{
        type:String,
        default:""
    },
    work_experience:{
        type:String,
        default:""
    },
    resume_title:{
        type:String,
        default:""
    },
    current_location:{
        type:String,
        default:""
    },
    postal_address:{
        type:String,
        default:""
    },
    current_employer:{
        type:String,
        default:""
    },
    current_designation:{
        type:String,
        default:""
    }


});


let employeeData = new mongoose.model('employee_data',employeeDetails);

module.exports = employeeData;