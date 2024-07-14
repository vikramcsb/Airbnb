/*
this is a simple code for try-catch block. Instead of using try-catch block we will use it 
as try-catch block makes the code bulky. so we will pass the function where we feel that it may
have error then the function is executed here and at the end a function is returned
*/
module.exports = (fn) => {
      return (req,res,next) => {
            fn(req,res,next).catch(next);
      };
};