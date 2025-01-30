const asyncHandler = (requestHandler) => {
     return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
     }
}



export {asyncHandler}

/*
aa UnComment  na karvu khali 24 me line samajava mate banayu che
const asyncHandler = () => {}
const asyncHandler = (func) => {() => {}}
const asyncHandler = (func) => async () => {}
*/


// const asyncHandler = (fn) => async(req, res, next) => {
//       try {
//             await fn(req, res, next)
//       } catch (err) {
//           res.status(err.code || 500).json({
//              success: false,
//              message: err.message
//           })
//       }
// }