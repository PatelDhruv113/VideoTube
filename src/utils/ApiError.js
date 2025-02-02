class ApiError extends Error {   // extends to Error class
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""    // he stack information (or stack trace) is a detailed log of where an error occurred within your code, showing the series of function calls leading to the error. It is a vital tool for debugging, helping you trace back to the source of the problem.
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
