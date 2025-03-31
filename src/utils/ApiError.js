class ApiError extends Error {   // extends to Error class
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""    //where line on error occured
    )
    {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors
        
        if(stack)
        {
            this.stack = stack
        }else{
             Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}
