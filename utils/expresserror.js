/*
this is basically our custom error handler where we have to send the status code and message
*/
class expresserror extends Error{
      constructor(statuscode,message){
            super();
            this.statusCode=statuscode;
            this.message=message;
      }
}

module.exports=expresserror;