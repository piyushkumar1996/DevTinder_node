const userAuth = (req, res, next) => {
    console.log('check authentication');
    const token = 'xyz';
    const isAuthorized = token === 'xyz';
    if(!isAuthorized){
        res.status(401).send('User is unauthorized');
    }else {
        next()
    }
}

module.exports = {
    userAuth
}