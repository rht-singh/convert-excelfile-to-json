const employee_data = require('../database/model');
const path = require('path');
const readXlsxFile = require('read-excel-file/node');
const fs = require('fs')
class API{

    async getData(req,res){
        try{
            let data = await employee_data.find();
            if(data.length>0) res.status(200).send({success:true,data_length:data.length,data})
            else return res.status(404).send({success:false,error:"No data found"})
        }
        catch(err){
            console.error(new Error(err))
            res.status(404).send({success:false,error:err})
        }
    }


    async addData(req,res){
      try{
        let {excel} = req.files;
        if (req.files == undefined) {
            return res.status(400).send("Please upload an excel file!");
          }
          else{
        let extension = path.extname(excel.name);
        if(extension == ".xlsx" || extension == ".xls"){
            let pathOfUpload = path.dirname(__dirname)+`/files/${excel.name}`+extension;
            
            var excel_extracted_data = [];
            await excel.mv(pathOfUpload)
            let excel_data = await readXlsxFile(pathOfUpload);
            excel_data.shift();
            excel_data.forEach(row=>{

                var data = {
                   Name_of_candidate:row[0],
                   email:row[1],
                   mobile_no:row[2],
                   date_of_birth:row[3],
                   work_experience:row[4],
                   resume_title:row[5],
                   current_location:row[6],
                   postal_address:row[7],
                   current_employer:row[8],
                   current_designation:row[9]
    
                }
                excel_extracted_data.push(data);
            })
            
             for(let i=0;i<excel_extracted_data.length;i++){
                 if(excel_extracted_data[i].Name_of_candidate && excel_extracted_data[i].email){

                     let find =  employee_data.findOne({email:excel_extracted_data[i].email},(err)=>{
                         if(err) console.log(err)
                         else{
                              new employee_data({
                                 Name_of_candidate:excel_extracted_data[i].Name_of_candidate,
                                 email:excel_extracted_data[i].email,mobile_no:excel_extracted_data[i].mobile_no,
                                 date_of_birth:excel_extracted_data[i].date_of_birth,
                                 work_experience:excel_extracted_data[i].work_experience,
                                 resume_title:excel_extracted_data[i].resume_title,
                                 current_location:excel_extracted_data[i].current_location,
                                 postal_address:excel_extracted_data[i].postal_address,
                                 current_employer:excel_extracted_data[i].current_employer,
                                 current_designation:excel_extracted_data[i].current_designation},(err)=>{
                                     if(err) console.log(err)
                                 })
                         }
                     });
                  

              }
                    
             }
             let findData = await employee_data.find();
             if(findData.length>0) {
                fs.unlink(pathOfUpload,(err)=>{
                    if(err) console.log(err);
                    else res.json({success:true,findData})
                }) 
                
            }
             else {
                res.json({success:false,error:"Data not saved yet"})
            }

        }
        else return res.status(400).send({success:false,error:"Please upload excel file."})
    }
      }
      catch(err){
          console.error(new Error(err))
          res.status(400).send({success:false,error:"Please upload excel file."})
      }
    }

}


module.exports = new API();