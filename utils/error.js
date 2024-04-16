//Developer defined error that can be used when developer wants to raise error as requires

//example password length should be of length 7 if not should raise error
//so for that error we use this function

export const errorHandler = (statusCode,message)=>{
    const error = new Error();
    error.statusCode = statusCode;
    error.message=message;
    return error;
}