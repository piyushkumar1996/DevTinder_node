# DevTinder APIs

# authRouter
- POST /signup
- POST /login
- POST /logout

# profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/pasword

# connectRequestRouter
- POST /connection/:status/:toUserId
- POST /connection/:status/:toUserId


- POST /connection/review/:status/:requestId
- POST /connection/review/:status/:requestId


# userRouer
- GET /user/connection
- GET /user/requests/recieved
- GET /feeds - gets the profile of other users on the platform



status : interested, ignore, accept, reject
