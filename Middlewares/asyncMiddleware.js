export const AsyncMiddleware = (givenFn) => (req,res,next) => {
    Promise.resolve(givenFn(req,res,next)).catch(next)
}